import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/customer/dashboard';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (err) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let role = user.user_metadata?.role;

        // If role not yet stored in user_metadata, infer from destination or existing store profile
        if (!role) {
          if (next.includes("shopkeeper")) {
            role = "shopkeeper";
            await supabase.auth.updateUser({
              data: { role: "shopkeeper" },
            });
          } else {
            const { data: profile } = await supabase
              .from("shopkeeper")
              .select("user_id")
              .eq("user_id", user.id)
              .maybeSingle();

            role = profile ? "shopkeeper" : "customer";
            await supabase.auth.updateUser({
              data: { role },
            });
          }
        }
        
        let finalRedirect = next;
        if (role === "shopkeeper" && finalRedirect.startsWith("/customer")) {
          finalRedirect = "/shopkeeper/dashboard";
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
