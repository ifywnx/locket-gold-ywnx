// ifywnx: only modify Locket requests.
(function () {
  const headers = $request.headers || {};
  const ua = headers['User-Agent'] || headers['user-agent'] || '';
  if (!ua.includes('Locket')) { $done({}); return; }
  const updated = { ...headers };
  for (const key of Object.keys(updated)) {
    if (key.toLowerCase() === 'x-revenuecat-etag') delete updated[key];
  }
  $done({ headers: updated });
})();
