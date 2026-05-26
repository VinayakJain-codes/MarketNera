import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Create a browser-based supabase client that automatically syncs sessions to cookies
const client = createBrowserClient(supabaseUrl, supabaseKey);

// Developer Sandbox Bypass Interceptor
if (typeof window !== 'undefined') {
  // Override getUser to simulate a logged-in session when bypass cookie is active
  const originalGetUser = client.auth.getUser.bind(client.auth);
  client.auth.getUser = async (token?: string) => {
    const devBypassRole = document.cookie
      .split('; ')
      .find((row) => row.startsWith('dev_bypass_role='))
      ?.split('=')[1];
      
    if (devBypassRole) {
      return {
        data: {
          user: {
            id: devBypassRole === 'shopkeeper' ? 'mock-shopkeeper-uuid-12345' : 'mock-customer-uuid-67890',
            email: `${devBypassRole}@marketnera.dev`,
            user_metadata: {
              full_name: devBypassRole === 'shopkeeper' ? 'Vinayak Jain (Shop Owner)' : 'Vinayak Jain (Customer)',
            },
            role: devBypassRole,
          } as any
        },
        error: null
      };
    }
    return originalGetUser(token);
  };

  // Override getSession to match the mock session when bypass cookie is active
  const originalGetSession = client.auth.getSession.bind(client.auth);
  client.auth.getSession = async () => {
    const devBypassRole = document.cookie
      .split('; ')
      .find((row) => row.startsWith('dev_bypass_role='))
      ?.split('=')[1];

    if (devBypassRole) {
      const mockUser = {
        id: devBypassRole === 'shopkeeper' ? 'mock-shopkeeper-uuid-12345' : 'mock-customer-uuid-67890',
        email: `${devBypassRole}@marketnera.dev`,
        user_metadata: {
          full_name: devBypassRole === 'shopkeeper' ? 'Vinayak Jain (Shop Owner)' : 'Vinayak Jain (Customer)',
        },
        role: devBypassRole,
      } as any;
      return {
        data: {
          session: {
            access_token: 'mock-access-token',
            token_type: 'bearer',
            expires_in: 3600,
            user: mockUser,
          } as any,
        },
        error: null,
      };
    }
    return originalGetSession();
  };

  // Override signOut to clean up the dev bypass cookie
  const originalSignOut = client.auth.signOut.bind(client.auth);
  client.auth.signOut = async (options?: any) => {
    document.cookie = 'dev_bypass_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    return originalSignOut(options);
  };
}

export const supabase = client;

