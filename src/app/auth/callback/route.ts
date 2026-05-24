import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/customer/dashboard';

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
            });
          },
        },
      }
    );
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const role = user.user_metadata?.role || "customer";
        
        let finalRedirect = next;
        if (role === "shopkeeper" && finalRedirect.startsWith("/customer")) {
          finalRedirect = "/shopkeeper/setup";
        } else if (role === "customer" && finalRedirect.startsWith("/shopkeeper")) {
          finalRedirect = "/customer/dashboard";
        }
        
        return NextResponse.redirect(new URL(finalRedirect, request.url));
      }
    }
  }

  // Fallback to customer login on error
  return NextResponse.redirect(new URL('/login/customer', request.url));
}
