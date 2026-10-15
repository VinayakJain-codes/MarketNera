import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/customer/dashboard';
  const errorDescription = requestUrl.searchParams.get('error_description') || requestUrl.searchParams.get('error');

  const isBusinessFlow = next.includes('shopkeeper') || next.includes('shops');

  if (errorDescription) {
    console.error('OAuth callback error:', errorDescription);
    const redirectUrl = isBusinessFlow 
      ? `/login/shopkeeper?error=${encodeURIComponent(errorDescription)}`
      : `/login/customer?error=${encodeURIComponent(errorDescription)}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (code) {
    // Array to collect cookies set by Supabase during code exchange
    const cookiesToSetOnResponse: { name: string; value: string; options: any }[] = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach((c) => {
              cookiesToSetOnResponse.push(c);
            });
          },
        },
      }
    );
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        let finalRedirect = next;

        if (isBusinessFlow) {
          // Check if this merchant already has a registered store profile
          const { data: profile } = await supabase
            .from('shopkeeper')
            .select('user_id')
            .eq('user_id', user.id)
            .maybeSingle();

          // Ensure user metadata role is set to shopkeeper
          await supabase.auth.updateUser({
            data: { role: 'shopkeeper' },
          });

          if (!profile) {
            // New merchant or profile not completed -> send to setup
            finalRedirect = '/shopkeeper/setup';
          } else {
            // Existing merchant -> send to dashboard
            finalRedirect = '/shopkeeper/dashboard';
          }
        } else {
          // Customer flow: if role not yet set, check if they are actually a shopkeeper
          const currentRole = user.user_metadata?.role;
          if (!currentRole) {
            const { data: profile } = await supabase
              .from('shopkeeper')
              .select('user_id')
              .eq('user_id', user.id)
              .maybeSingle();

            const role = profile ? 'shopkeeper' : 'customer';
            await supabase.auth.updateUser({
              data: { role },
            });
          }
        }

        const response = NextResponse.redirect(new URL(finalRedirect, request.url));

        // CRITICAL: Attach all session cookies directly onto the redirect response
        cookiesToSetOnResponse.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        return response;
      }
    } else {
      console.error('Failed to exchange code for session:', error);
      const redirectUrl = isBusinessFlow
        ? `/login/shopkeeper?error=${encodeURIComponent(error.message)}`
        : `/login/customer?error=${encodeURIComponent(error.message)}`;
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Fallback if no code is provided
  const redirectUrl = isBusinessFlow ? '/login/shopkeeper' : '/login/customer';
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
