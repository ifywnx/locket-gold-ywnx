/**
 * Guided ONE-SESSION E2E regression runner on a user's own iPhone.
 * Records evidence-free statuses only; never touches Locket auth or users.
 * node "Bản thử nghiệm/V7_Full_Regression/tests/run_device_session.mjs"
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
const file = path.join(path.dirname(fileURLToPath(import.meta.url)), 'device_scenarios.json');
const input = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!stdin.isTTY) {
  console.error('Interactive iPhone required: run this in Terminal, not in an unattended CI job.');
  process.exitCode = 2;
} else {
  const io = readline.createInterface({input: stdin, output: stdout});
  const result = [];
  try {
    console.log('\nIFYWNX V7 — One-session iPhone regression');
    console.log('Use your own authorized account. Do not paste access tokens or private messages.');
    const variant = (await io.question('Test version (e.g. V3 / V6 candidate): ')).trim().slice(0, 80);
    const os = (await io.question('iPhone / iOS version (no serial/UDID): ')).trim().slice(0, 100);
    for (const [index, test] of input.scenarios.entries()) {
      console.log('\n' + (index+1) + '/' + input.scenarios.length + ' — ' + test.id + ' · ' + test.name);
      console.log('THỰC HIỆN: ' + test.steps);
      console.log('ĐẠT NẾU: ' + test.expected);
      let status = '';
      while (!['P','F','B','S'].includes(status)) {
        status=(await io.question('P=PASS, F=FAIL, B=BLOCKED (không có tính năng), S=SKIP: ')).trim().toUpperCase();
      }
      const note = (await io.question('Ghi chú ngắn (không chứa dữ liệu riêng tư): ')).trim().slice(0,300);
      result.push({id:test.id,name:test.name,status:({P:'PASS',F:'FAIL',B:'BLOCKED',S:'SKIP'})[status],note});
    }
    const summary={testKind:'DEVICE_MANUAL_REGRESSION',created:new Date().toISOString(),variant,device:os,
      counts:Object.fromEntries(['PASS','FAIL','BLOCKED','SKIP'].map(status=>[status,result.filter(x=>x.status===status).length])),
      result};
    const dest=path.resolve(process.cwd(),'v7-device-regression-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json');
    fs.writeFileSync(dest,JSON.stringify(summary,null,2)+'\n',{flag:'wx',mode:0o600});
    console.log('\nĐã lưu báo cáo:',dest);
    console.log(summary.counts);
    if(summary.counts.FAIL||summary.counts.BLOCKED)process.exitCode=1;
  } finally { io.close(); }
}
