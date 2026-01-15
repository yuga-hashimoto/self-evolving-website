import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

  // Cookie already exists, pass through
  if (cookieLocale === 'ja' || cookieLocale === 'en') {
    return NextResponse.next();
  }

  // Detect language from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLocale = 'en'; // Default to English

  if (acceptLanguage) {
    const isJapanese = acceptLanguage.split(',').some(lang =>
      lang.trim().toLowerCase().startsWith('ja')
    );
    detectedLocale = isJapanese ? 'ja' : 'en';
  }

  // Set Cookie in response
  const response = NextResponse.next();
  response.cookies.set('NEXT_LOCALE', detectedLocale, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
