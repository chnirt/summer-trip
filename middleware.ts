import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookieStore = await cookies(); // cookies() là sync, không cần await
  const allCookies = cookieStore.getAll();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => allCookies,
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Nếu chưa đăng nhập và không ở trang /login thì redirect về /login
  if (error || !user) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Lấy profile theo email user
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_confirmed")
    .eq("email", user.email)
    .single();

  if (profileError || !profile) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { role, is_confirmed: isConfirmed } = profile;

  // Phân quyền admin
  if (role === "admin") {
    if (!pathname.startsWith("/admin") || pathname === "/login") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // Phân quyền user
  if (role === "user") {
    // User không được vào admin
    if (pathname.startsWith("/admin") || pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Nếu chưa confirm, redirect về confirm-info (trừ khi đang ở confirm-info)
    if (!isConfirmed && pathname !== "/confirm-info") {
      return NextResponse.redirect(new URL("/confirm-info", req.url));
    }

    // Nếu đã confirm mà đang ở confirm-info thì redirect về /
    if (isConfirmed && pathname === "/confirm-info") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Cho phép tiếp tục
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
