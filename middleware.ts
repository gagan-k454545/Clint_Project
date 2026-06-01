import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;

    // Redirect logged-in users away from auth pages
    if (pathname.startsWith('/auth/') && token) {
      const dashHref =
        role === 'recruiter'
          ? '/dashboard/recruiter'
          : '/dashboard/candidate';
      return NextResponse.redirect(new URL(dashHref, req.url));
    }

    // Recruiters must not access candidate dashboard
    if (pathname.startsWith('/dashboard/candidate') && role === 'recruiter') {
      return NextResponse.redirect(new URL('/dashboard/recruiter', req.url));
    }

    // Candidates must not access recruiter dashboard
    if (pathname.startsWith('/dashboard/recruiter') && role === 'candidate') {
      return NextResponse.redirect(new URL('/dashboard/candidate', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;
        // Protect all /dashboard routes
        if (pathname.startsWith('/dashboard')) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
