import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json();
    console.log('Received admin request for:', { email, name });

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists in auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error checking auth users:', authError);
      return NextResponse.json(
        { error: 'Error checking existing users' },
        { status: 500 }
      );
    }

    const existingAuthUser = authUsers.users.find(user => user.email === email);
    
    if (existingAuthUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Check if there's already a pending admin request
    const { data: existingRequest, error: requestError } = await supabaseAdmin
      .from('admin_requests')
      .select('id, status')
      .eq('email', email)
      .eq('status', 'pending')
      .maybeSingle();

    if (requestError) {
      console.error('Error checking existing request:', requestError);
      return NextResponse.json(
        { error: `Error checking existing requests: ${requestError.message}` },
        { status: 500 }
      );
    }

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Admin request already pending for this email' },
        { status: 400 }
      );
    }

    // Create user account with regular user role first
    console.log('Creating user account...');
    const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name
      }
    });

    if (createUserError) {
      console.error('Error creating user:', createUserError);
      return NextResponse.json(
        { error: `Failed to create user account: ${createUserError.message}` },
        { status: 500 }
      );
    }

    // Check if profile already exists (just in case)
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('id', newUser.user.id)
      .maybeSingle();

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error('Error checking existing profile:', profileCheckError);
      // Clean up the auth user if profile check fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return NextResponse.json(
        { error: 'Error checking existing profile' },
        { status: 500 }
      );
    }

    if (existingProfile) {
      // Profile already exists, just update it
      console.log('Profile already exists, updating...');
      const { error: updateProfileError } = await supabaseAdmin
        .from('profiles')
        .update({
          email,
          name,
          role: 'user',
          updated_at: new Date().toISOString()
        })
        .eq('id', newUser.user.id);

      if (updateProfileError) {
        console.error('Error updating profile:', updateProfileError);
        // Clean up the auth user if profile update fails
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        return NextResponse.json(
          { error: `Failed to update user profile: ${updateProfileError.message}` },
          { status: 500 }
        );
      }
    } else {
      // Create new profile
      console.log('Creating user profile...');
      const { error: createProfileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: newUser.user.id,
          email,
          name,
          role: 'user', // Start as regular user
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (createProfileError) {
        console.error('Error creating profile:', createProfileError);
        // Clean up the auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
        return NextResponse.json(
          { error: `Failed to create user profile: ${createProfileError.message}` },
          { status: 500 }
        );
      }
    }

    // Create admin request record
    console.log('Creating admin request...');
    const { data: adminRequest, error: insertError } = await supabaseAdmin
      .from('admin_requests')
      .insert({
        user_id: newUser.user.id, // Store the user ID for easier reference
        email,
        name,
        status: 'pending',
        requested_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating admin request:', insertError);
      // We still keep the user account as they can use it normally
      return NextResponse.json(
        { 
          message: 'Account created successfully, but admin request failed. You can login with regular access.',
          userId: newUser.user.id 
        },
        { status: 200 }
      );
    }

    // Send email notification to admin
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
      console.error('Email environment variables not set');
      return NextResponse.json(
        { 
          message: 'Account created and admin request submitted, but email notification failed',
          userId: newUser.user.id 
        },
        { status: 200 }
      );
    }

    try {
      console.log('Sending email notification...');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin-request/confirm?id=${adminRequest.id}&token=${generateToken(adminRequest.id)}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Admin Access Request - TaskOv',
        html: `
          <h2>New Admin Access Request & Account Created</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>User ID:</strong> ${newUser.user.id}</p>
          <p><strong>Account Status:</strong> ✅ Created and Active</p>
          <p><strong>Current Role:</strong> Regular User</p>
          <p><strong>Requested at:</strong> ${new Date().toLocaleString()}</p>
          
          <p><strong>Note:</strong> A new user account has been created and is ready to use. The user can login immediately with regular access. Approving this request will upgrade them to admin privileges.</p>
          
          <div style="margin: 20px 0;">
            <a href="${confirmUrl}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Approve Admin Request
            </a>
          </div>
          
          <p><em>Approving will upgrade this user's role from 'user' to 'admin'.</em></p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    return NextResponse.json(
      { 
        message: 'Account created successfully! Admin request sent for approval. You can login now with regular access.',
        userId: newUser.user.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in admin request:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

function generateToken(requestId: string): string {
  return Buffer.from(`${requestId}-${process.env.JWT_SECRET}`).toString('base64');
}