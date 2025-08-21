import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userEmail, taskTitle, taskDeadline } = await request.json();

  // Note: Use service_role key for admin-level access.
  // Ensure this is set in your environment variables.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log(
    'Service Key Loaded:',
    serviceKey ? `Yes, starts with ${serviceKey.slice(0, 5)} and ends with ${serviceKey.slice(-5)}` : 'No'
  );

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Find user by email
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError) {
      return NextResponse.json({ error: `User not found: ${userError.message}` }, { status: 500 });
    }
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Create the task
    const { data: taskData, error: taskError } = await supabaseAdmin
      .from('tasks')
      .insert({ title: taskTitle, description: '', priority: 'medium', status: 'pending', assigned_to: userData.id })
      .select()
      .single();

    if (taskError) {
      return NextResponse.json({ error: taskError.message }, { status: 500 });
    }

    // 3. Create the assignment
    const { data: assignmentData, error: assignmentError } = await supabaseAdmin
      .from('task_assignments')
      .insert({ user_id: userData.id, task_id: taskData.id, assigned_date: new Date().toISOString().slice(0, 10), due_date: taskDeadline })
      .select()
      .single();

    if (assignmentError) {
      return NextResponse.json({ error: assignmentError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Task assigned successfully', assignment: assignmentData });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
