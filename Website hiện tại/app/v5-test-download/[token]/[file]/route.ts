import { valid, secureHeaders } from '../../../../lib/access';
import { v5TestAssets } from '../../../../lib/v5-test-assets';

// V5 private test delivery. Existing /download and /test-download remain untouched.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string; file: string }> }
) {
  const { token, file } = await params;
  if (!await valid(token)) {
    return new Response('Access denied', { status: 403, headers: secureHeaders });
  }
  if (!Object.hasOwn(v5TestAssets, file)) {
    return new Response('Not found', { status: 404, headers: secureHeaders });
  }
  const base = new URL(request.url).origin +
    '/v5-test-download/' + encodeURIComponent(token) + '/';
  const contents = v5TestAssets[file].replaceAll('__V5_ASSET_BASE__', base);
  const headers = {
    ...secureHeaders,
    'X-Robots-Tag': 'noindex, nofollow',
    'Content-Type': file.endsWith('.mobileconfig')
      ? 'application/x-apple-aspen-config'
      : file.endsWith('.js') ? 'application/javascript; charset=utf-8'
      : 'text/plain; charset=utf-8',
    ...(file.endsWith('.mobileconfig')
      ? { 'Content-Disposition': 'attachment; filename="ifywnx-Locket-DNS.mobileconfig"' }
      : {}),
  };
  return new Response(contents, { headers });
}
