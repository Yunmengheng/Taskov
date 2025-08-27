import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const token = searchParams.get('token');

  if (!id || !token) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Verify token
    const expectedToken = Buffer.from(`${id}-${process.env.JWT_SECRET}`).toString('base64');
    if (token !== expectedToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 403 }
      );
    }

    // Get the admin request
    const { data: adminRequest, error: requestError } = await supabaseAdmin
      .from('admin_requests')
      .select('*')
      .eq('id', id)
      .eq('status', 'pending')
      .single();

    if (requestError || !adminRequest) {
      return NextResponse.json(
        { error: 'Admin request not found or already processed' },
        { status: 404 }
      );
    }

    // Check if user exists in profiles
    const { data: user, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', adminRequest.email)
      .maybeSingle();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error checking user:', userError);
      return NextResponse.json(
        { error: 'Error checking user' },
        { status: 500 }
      );
    }

    if (user) {
      // Update existing user role to admin
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating user role:', updateError);
        return NextResponse.json(
          { error: 'Failed to update user role' },
          { status: 500 }
        );
      }
    }

    // Mark request as approved
    const { error: updateRequestError } = await supabaseAdmin
      .from('admin_requests')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateRequestError) {
      console.error('Error updating request status:', updateRequestError);
      return NextResponse.json(
        { error: 'Failed to update request status' },
        { status: 500 }
      );
    }

    // Return success page with landing page styling
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Admin Access Granted - TaskOv</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  colors: {
                    gray: {
                      900: '#111827',
                      800: '#1f2937',
                      700: '#374151',
                      600: '#4b5563',
                      500: '#6b7280',
                      400: '#9ca3af',
                      300: '#d1d5db'
                    },
                    blue: {
                      500: '#3b82f6',
                      600: '#2563eb',
                      700: '#1d4ed8'
                    }
                  }
                }
              }
            }
          </script>
          <style>
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
            }
            .fade-in-up {
              animation: fadeInUp 0.8s ease-out;
            }
            .success-pulse {
              animation: pulse 2s infinite;
            }
          </style>
        </head>
        <body class="bg-gray-900 text-gray-300 min-h-screen">
          <!-- Header -->
          <header class="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex justify-between h-16 items-center">
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2"></path>
                  </svg>
                  <span class="ml-2 text-xl font-bold text-white">TaskOv</span>
                </div>
              </div>
            </div>
          </header>

          <!-- Main Content -->
          <main class="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
            <div class="max-w-2xl w-full">
              <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 sm:p-12 text-center fade-in-up">
                <!-- Success Icon -->
                <div class="mx-auto mb-8 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center success-pulse">
                  <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>

                <!-- Success Message -->
                <h1 class="text-3xl sm:text-4xl font-bold text-white mb-4">
                  🎉 Admin Access Granted!
                </h1>
                
                <p class="text-lg text-gray-400 mb-8">
                  The administrator privileges have been successfully granted.
                </p>

                <!-- User Details Card -->
                <div class="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
                  <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-gray-700">
                      <span class="text-gray-400 font-medium">Name:</span>
                      <span class="text-white font-semibold">${adminRequest.name}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-700">
                      <span class="text-gray-400 font-medium">Email:</span>
                      <span class="text-white font-semibold">${adminRequest.email}</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                      <span class="text-gray-400 font-medium">Approved:</span>
                      <span class="text-blue-400 font-semibold">${new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>

                <!-- Status Message -->
                <div class="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mb-8">
                  <div class="flex items-center justify-center mb-2">
                    <svg class="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-blue-400 font-semibold">Access Updated</span>
                  </div>
                  <p class="text-blue-300 text-sm">
                    The user can now access all administrator features and manage the TaskOv platform.
                  </p>
                </div>

                <!-- Action Button -->
                <div class="space-y-4">
                  <button 
                    onclick="window.close()" 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg w-full sm:w-auto"
                  >
                    Close Window
                  </button>
                  <p class="text-gray-500 text-sm">
                    This window can be safely closed.
                  </p>
                </div>
              </div>
            </div>
          </main>

          <!-- Footer -->
          <footer class="bg-gray-900 py-8 border-t border-gray-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center">
                <div class="flex items-center justify-center mb-4">
                  <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2"></path>
                  </svg>
                  <span class="text-lg font-bold text-white">TaskOv</span>
                </div>
                <p class="text-gray-500 text-sm">
                  © ${new Date().getFullYear()} TaskOv. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );

  } catch (error) {
    console.error('Error confirming admin request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}