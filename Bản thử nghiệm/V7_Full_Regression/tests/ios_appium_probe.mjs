/**
 * Read-only Appium XCUITest bootstrap probe for an iPhone the user owns or may test.
 * Does NOT click, buy, send photos, change app state, or bypass entitlements.
 *
 * Prereqs: Node 20+, Appium 2/3 with XCUITest driver, signed WebDriverAgent,
 * a connected trusted iPhone, the actual Locket bundle identifier, and local
 * user permission. Start Appium server separately.
 *
 * Usage:
 *   LOCKET_BUNDLE_ID=... IOS_UDID=... node ios_appium_probe.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const endpoint = (process.env.APPIUM_URL || 'http://127.0.0.1:4723').replace(/\/$/, '');
const bundleId = process.env.LOCKET_BUNDLE_ID || '';
const udid = process.env.IOS_UDID || '';
const deviceName = process.env.IOS_DEVICE_NAME || 'iPhone';
const platformVersion = process.env.IOS_VERSION || '';
if (!bundleId || !udid || !/^[a-zA-Z0-9_.-]+$/.test(bundleId)) {
  console.error('Set LOCKET_BUNDLE_ID and IOS_UDID for your OWN trusted iPhone.');
  process.exit(2);
}
const call = async (method, suffix, payload) => {
  const resp = await fetch(endpoint + suffix, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
    signal: AbortSignal.timeout(60000),
  });
  let data;
  try { data = await resp.json(); } catch { data = { value: { error: 'Non-JSON Appium response' } }; }
  if (!resp.ok || data.value?.error) throw new Error(method + ' ' + suffix + ': ' + JSON.stringify(data.value?.error || resp.status));
  return data;
};
const cap = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': deviceName,
  'appium:udid': udid,
  'appium:bundleId': bundleId,
  'appium:noReset': true,
  'appium:autoAcceptAlerts': false,
};
if (platformVersion) cap['appium:platformVersion'] = platformVersion;
let sessionId;
const dir = path.resolve(process.cwd(), 'v7-ios-probe-' + new Date().toISOString().replace(/[:.]/g, '-'));
try {
  console.log('Starting authorized read-only session:', deviceName);
  const response = await call('POST', '/session', {
    capabilities: { alwaysMatch: cap, firstMatch: [{}] },
  });
  sessionId = response.value?.sessionId || response.sessionId;
  if (!sessionId) throw new Error('Appium did not return a session ID');
  const xml = (await call('GET', '/session/' + sessionId + '/source')).value;
  const screenshot = (await call('GET', '/session/' + sessionId + '/screenshot')).value;
  if (typeof xml !== 'string' || typeof screenshot !== 'string') throw new Error('Source or screenshot missing');
  fs.mkdirSync(dir, { recursive: false, mode: 0o700 });
  fs.writeFileSync(path.join(dir, 'accessibility.xml'), xml, { mode: 0o600 });
  fs.writeFileSync(path.join(dir, 'screen.png'), Buffer.from(screenshot, 'base64'), { mode: 0o600 });
  fs.writeFileSync(path.join(dir, 'status.json'), JSON.stringify({
    kind: 'READ_ONLY_UI_PROBE', created: new Date().toISOString(),
    bundleId, deviceName, platformVersion, actionsExecuted: ['launch', 'getSource', 'screenshot'],
  }, null, 2));
  console.log('Saved LOCAL evidence to:', dir);
  console.log('PRIVATE DATA WARNING: screen.png and accessibility.xml can contain messages, contacts or photos. Review/redact before sharing.');
} catch (error) {
  console.error('Appium probe failed:', String(error.message || error));
  process.exitCode = 1;
} finally {
  if (sessionId) {
    try { await call('DELETE', '/session/' + sessionId); } catch {}
  }
}
