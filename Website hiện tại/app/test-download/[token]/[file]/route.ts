import { valid, secureHeaders } from '../../../../lib/access';
import { v4TestAssets } from '../../../../lib/v4-test-assets';

// Isolated, token-protected V4 test downloads. Production /download remains unchanged.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string; file: string }> }
) {
  const { token, file } = await params;
  if (!await valid(token)) {
    return new Response('Access denied', { status: 403, headers: secureHeaders });
  }
  if (!Object.hasOwn(v4TestAssets, file)) {
    return new Response('Not found', { status: 404, headers: secureHeaders });
  }

  const base = new URL(request.url).origin +
    '/test-download/' + encodeURIComponent(token) + '/';
  const body = v4TestAssets[file].replaceAll('__V4_TEST_BASE_URL__', base);
  const mime = file.endsWith('.js')
    ? 'application/javascript; charset=utf-8'
    : 'text/plain; charset=utf-8';
  return new Response(body, {
    headers: {
      ...secureHeaders,
      'Content-Type': mime,
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
