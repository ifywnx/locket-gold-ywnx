import { valid, secureHeaders } from '../../../../lib/access';
import { v6TestAssets } from '../../../../lib/v6-test-assets';
import { getV6Choice } from '../../../../lib/v6-widget-choice';

// Private, test-only delivery. Production /download is unchanged.
// Any widget replacement is explicitly chosen on the separate website page.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string; file: string }> }
) {
  const { token, file } = await params;
  if (!await valid(token)) {
    return new Response('Access denied', { status: 403, headers: secureHeaders });
  }
  if (!Object.hasOwn(v6TestAssets, file)) {
    return new Response('Not found', { status: 404, headers: secureHeaders });
  }
  const sourceUrl = new URL(request.url);
  const choice = getV6Choice(sourceUrl.searchParams);
  if (!choice) {
    return new Response('Invalid widget theme or image URL. Use PNG/JPG/WebP from i.ibb.co.', {
      status: 400,
      headers: secureHeaders,
    });
  }

  const scriptUrl = new URL(
    '/v6-download/' + encodeURIComponent(token) + '/Locket_V6_Creative.js',
    sourceUrl.origin
  );
  scriptUrl.searchParams.set('theme', choice.theme);
  if (choice.frameUrl) scriptUrl.searchParams.set('image', choice.frameUrl);
  if (choice.popup) scriptUrl.searchParams.set('popup', '1');

  const content = v6TestAssets[file]
    .replaceAll('__V6_SCRIPT_URL__', scriptUrl.toString())
    .replaceAll('__V6_SELECTED_FRAME_JSON__', JSON.stringify(choice.frameUrl))
    .replaceAll('__V6_ENABLE_POPUP__', choice.popup ? 'true' : 'false');

  const type = file.endsWith('.mobileconfig')
    ? 'application/x-apple-aspen-config'
    : file.endsWith('.js')
      ? 'application/javascript; charset=utf-8'
      : 'text/plain; charset=utf-8';

  return new Response(content, {
    headers: {
      ...secureHeaders,
      'Content-Type': type,
      'X-Robots-Tag': 'noindex, nofollow',
      ...(file.endsWith('.mobileconfig')
        ? { 'Content-Disposition': 'attachment; filename="ifywnx-Locket-DNS.mobileconfig"' }
        : {}),
    }
  });
}
