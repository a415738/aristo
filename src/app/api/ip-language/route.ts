import { NextResponse } from 'next/server';
import { getLanguageFromCountry } from '@/lib/ip-to-language';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // Get client IP from various headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    let clientIp = forwardedFor?.split(',')[0]?.trim() ||
                   realIp ||
                   cfConnectingIp ||
                   '127.0.0.1';

    // Skip localhost
    if (clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === 'localhost') {
      return NextResponse.json({
        language: 'en',
        country: null,
        ip: clientIp,
        source: 'localhost'
      });
    }

    // Use ip-api.com for geolocation (free for non-commercial use)
    // Rate limit: 45 requests per minute
    try {
      const geoResponse = await fetch(`http://ip-api.com/json/${clientIp}?fields=countryCode`, {
        headers: {
          'User-Agent': 'AristoBeauty/1.0'
        },
        next: { revalidate: 86400 } // Cache for 24 hours
      });

      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        const countryCode = geoData.countryCode;
        const language = getLanguageFromCountry(countryCode);

        return NextResponse.json({
          language,
          country: countryCode,
          ip: clientIp,
          source: 'geo-api'
        });
      }
    } catch (geoError) {
      console.error('GeoIP lookup failed:', geoError);
    }

    // Fallback to English
    return NextResponse.json({
      language: 'en',
      country: null,
      ip: clientIp,
      source: 'fallback'
    });
  } catch (error) {
    console.error('IP language detection error:', error);
    return NextResponse.json({
      language: 'en',
      country: null,
      ip: null,
      source: 'error'
    });
  }
}
