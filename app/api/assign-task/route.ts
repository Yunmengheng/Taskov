import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userEmail, taskTitle, taskDeadline } = await request.json();

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('NEXT_PUBLIC_SUPABASE_URL is not set');
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey
    );

    // 1. Find user by email (this should match an existing user)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email') // Add name and email for debugging
      .eq('email', userEmail)
      .single();

    console.log('Found user:', userData); // Debug log

    if (userError) {
      return NextResponse.json({ error: `User not found: ${userError.message}` }, { status: 500 });
    }
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Create the task (this creates a NEW task)
    const { data: taskData, error: taskError } = await supabaseAdmin
      .from('tasks')
      .insert({
        title: taskTitle,
        description: '',
        priority: 'medium',
        status: 'pending',
        assigned_to: userData.id,
      })
      .select()
      .single();

    console.log('Created task:', taskData); // Debug log

    if (taskError) {
      return NextResponse.json({ error: taskError.message }, { status: 500 });
    }

    // 3. Create the assignment
    const { data: assignmentData, error: assignmentError } = await supabaseAdmin
      .from('task_assignments')
      .insert({
        user_id: userData.id,
        task_id: taskData.id,
        assigned_date: new Date().toISOString().slice(0, 10),
        due_date: taskDeadline,
      })
      .select()
      .single();

    if (assignmentError) {
      return NextResponse.json({ error: assignmentError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Task assigned successfully', assignment: assignmentData });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
