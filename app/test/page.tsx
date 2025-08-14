"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('🔍 Testing Supabase connection...');
      
      // Test auth
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
      console.log('🔍 Current user:', session?.user?.email || 'No user');

      // Test users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session?.user?.id);

      // Test database connection
      const { data, error, count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact' });

      console.log('🔍 Database test result:', { data, error, count });
      console.log('🔍 Users table result:', { userData, userError });
      
      setResult({ 
        tasks: { data, error, count }, 
        user: session?.user,
        userProfile: { userData, userError }
      });

    } catch (err) {
      console.error('❌ Test error:', err);
      setResult({ error: err });
    }
  };

  const testInsert = async () => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: 'Test Task from Test Page',
          description: 'Testing direct insert',
          status: 'pending',
          assigned_to: user.id
        }])
        .select();

      console.log('🔍 Insert result:', { data, error });
      alert(error ? `Error: ${error.message}` : 'Task inserted successfully!');
      
      // Refresh the test
      testConnection();
    } catch (err) {
      console.error('❌ Insert error:', err);
      alert(`Insert failed: ${err}`);
    }
  };

  const createUserProfile = async () => {
    if (!user) {
      alert('Please log in first');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .upsert([{
          id: user.id,
          email: user.email,
          name: user.email.split('@')[0]
        }])
        .select();

      console.log('🔍 User profile result:', { data, error });
      alert(error ? `Error: ${error.message}` : 'User profile created successfully!');
      
      // Refresh the test
      testConnection();
    } catch (err) {
      console.error('❌ User profile error:', err);
      alert(`User profile creation failed: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <button 
            onClick={testConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Test Connection
          </button>
          
          <button 
            onClick={createUserProfile}
            className="px-4 py-2 bg-purple-600 text-white rounded ml-2"
          >
            Create User Profile
          </button>
          
          <button 
            onClick={testInsert}
            className="px-4 py-2 bg-green-600 text-white rounded ml-2"
          >
            Test Insert Task
          </button>
        </div>

        <div className="mt-8 bg-slate-800 p-4 rounded">
          <h2 className="text-white font-semibold mb-2">Results:</h2>
          <pre className="text-gray-300 text-sm overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}