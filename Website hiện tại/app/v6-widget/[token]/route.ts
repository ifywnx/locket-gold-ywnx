import { valid, secureHeaders } from '../../../lib/access';
import { v6Themes } from '../../../lib/v6-widget-choice';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  if (!await valid(token)) {
    return new Response('Mã không hợp lệ hoặc đã hết hạn.', {
      status: 403, headers: secureHeaders
    });
  }
  const origin = new URL(request.url).origin;
  const themes = v6Themes.map((t) => {
    const ready = t.ready ? '' : '<span class="need">Cần ảnh ImgBB</span>';
    const thumb = t.id === 'shinchan'
      ? '<img loading="lazy" alt="Shin-chan" src="https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png">'
      : '<span class="emoji">' + t.emoji + '</span>';
    return '<button type="button" class="theme ' + t.id +
      '" data-id="' + t.id + '" aria-pressed="false">' +
      '<span class="thumb">' + thumb + '</span>' +
      '<span class="name">' + t.name + '</span>' + ready + '</button>';
  }).join('');
  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>Chọn chủ đề widget • ifywnx V6</title>
<style>
:root{color-scheme:dark;font-family:-apple-system,BlinkMacSystemFont,Inter,Arial,sans-serif;background:#090e1d;color:#eef3ff}
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(circle at top right,#222459,#0c1021 55%,#080b17);min-height:100vh}
main{max-width:780px;margin:0 auto;padding:28px 18px 60px}
h1{font-size:clamp(27px,5vw,40px);margin:8px 0 9px;letter-spacing:-.04em}
p{color:#a9b4d0;line-height:1.65}
.kicker{color:#b2a3ff;letter-spacing:.13em;text-transform:uppercase;font-size:12px;font-weight:800}
small{color:#a8b1ce}
.hint{padding:12px 15px;border:1px solid #34395c;border-radius:12px;background:#1b2042;margin:18px 0}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:22px 0}
@media(min-width:660px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.theme{border:2px solid #303754;background:#151b34;color:#fff;cursor:pointer;border-radius:19px;padding:12px;text-align:left;transition:border-color .2s,transform .2s;min-width:0}
.theme[aria-pressed=true]{border-color:#aaa4ff;box-shadow:0 0 0 2px #7d73da35}
.theme:hover{transform:translateY(-2px)}
.thumb{height:116px;display:flex;align-items:center;justify-content:center;border-radius:13px;margin-bottom:12px;background:linear-gradient(130deg,#4c4d92,#202a5a);overflow:hidden}
.thumb img{width:100%;height:100%;object-fit:contain}
.emoji{font-size:56px}
.capybara .thumb{background:linear-gradient(135deg,#e8a978,#654533)}
.chihuahua .thumb{background:linear-gradient(135deg,#ffdfae,#ba8973)}
.kitty .thumb{background:linear-gradient(135deg,#ffaed1,#dd85dc)}
.meme .thumb{background:linear-gradient(135deg,#b3f59e,#348a9a)}
.custom .thumb{background:linear-gradient(135deg,#87b9ee,#806ec9)}
.name{display:block;font-size:15px;font-weight:700}
.need{display:block;color:#adb9d7;font-size:11px;margin-top:4px}
.panel{border:1px solid #303757;background:#151b34;border-radius:17px;padding:18px;margin-bottom:14px}
label{display:block;font-weight:700;margin-bottom:8px}
input[type=url]{width:100%;padding:15px 13px;font-size:15px;border-radius:11px;border:1px solid #51597f;color:#fff;background:#0b1023}
.option{display:flex;gap:10px;align-items:center;color:#e6e6f9}
.option input{width:20px;height:20px}
.actions{display:grid;grid-template-columns:1fr;gap:11px}
@media(min-width:580px){.actions{grid-template-columns:1fr 1fr}}
.action{display:block;text-align:center;padding:15px;border-radius:13px;color:#15162d;background:#c0baff;text-decoration:none;font-weight:800}
.action.secondary{background:#304064;color:#f4f6ff}
.action[aria-disabled=true]{opacity:.4;pointer-events:none}
.error{color:#ffc3ca;min-height:24px}
.note{font-size:13px;margin:18px 0}
code{background:#272e4c;border-radius:5px;padding:2px 5px;color:#deecff}
</style>
</head>
<body>
<main>
<div class="kicker">IFYWNX / V6 EXPERIMENT</div>
<h1>Chọn chủ đề khung widget ✨</h1>
<p>Chọn khung của bạn, sau đó tải <strong>một</strong> cấu hình Shadowrocket tương ứng. Đây là trang chọn bên ngoài Locket; hình có hiển thị trong widget hay không vẫn phụ thuộc phiên bản ứng dụng.</p>
<div class="hint">V6 gồm 136 caption, chẩn đoán camera và tùy chọn popup chào mừng. Không giả lập quyền Gold và không tự mở khóa hiệu ứng “Tạo diện mạo”.</div>
<div class="grid" id="themes">${themes}</div>
<div class="panel" id="imagePanel" hidden>
<label for="image">URL ảnh PNG/JPG/WebP trên ImgBB</label>
<input id="image" type="url" autocomplete="off" spellcheck="false" placeholder="https://i.ibb.co/.../khung-cua-ban.png" maxlength="512">
<p class="note">Bạn cần tự tải ảnh lên ImgBB rồi sao chép <strong>Direct Link</strong> bắt đầu bằng <code>https://i.ibb.co/</code>. Chỉ dùng ảnh bạn có quyền sử dụng. Các chủ đề Capybara, Chihuahua, Kitty và Meme hiện chưa có ảnh mặc định.</p>
</div>
<div class="panel">
<label class="option"><input type="checkbox" id="popup"> Thử popup chào mừng V6 (không ghi đè popup sẵn có)</label>
</div>
<p class="error" id="error" role="status"></p>
<div class="actions">
<a id="config" class="action" aria-disabled="true" href="#">Tải cấu hình chính .conf</a>
<a id="module" class="action secondary" aria-disabled="true" href="#">Tải module .sgmodule</a>
</div>
<p class="note">Hai cách cài trên thay thế nhau, không bật đồng thời. Nếu bạn có cấu hình Shadowrocket nền đã hỗ trợ script/MITM, dùng module. Nếu cần cấu hình độc lập, dùng .conf. DNS V6 tùy chọn: <a id="dns" style="color:#b1a6ff" href="#">Tải .mobileconfig</a>.</p>
<p class="note">Tắt script Locket cũ trong khi thử V6 để tránh xử lý trùng. Không chia sẻ URL trang này vì link chứa mã truy cập của bạn.</p>
</main>
<script>
(function(){
  const token=${JSON.stringify(token)};
  const origin=${JSON.stringify(origin)};
  const base=origin+'/v6-download/'+token+'/';
  const buttons=Array.from(document.querySelectorAll('.theme'));
  const input=document.getElementById('image');
  const panel=document.getElementById('imagePanel');
  const popup=document.getElementById('popup');
  const error=document.getElementById('error');
  const config=document.getElementById('config');
  const module=document.getElementById('module');
  const dns=document.getElementById('dns');
  let theme='original';
  function validImage(s){
    if(!s||s.length>512)return false;
    try{
      const u=new URL(s);
      return u.protocol==='https:'&&u.hostname==='i.ibb.co'&&!u.username&&!u.password&&
        !u.search&&!u.hash&&!u.pathname.includes('..')&&
        /^\\/[a-zA-Z0-9_./-]+\\.(png|jpe?g|webp)$/i.test(u.pathname);
    }catch(e){return false;}
  }
  function update(){
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===theme)));
    const custom=theme!=='original'&&theme!=='shinchan';
    panel.hidden=!custom;
    const ok=!custom||validImage(input.value.trim());
    error.textContent=ok?'':'Hãy nhập Direct Link ảnh hợp lệ từ i.ibb.co (.png, .jpg, .webp).';
    const q=new URLSearchParams({theme});
    if(custom&&ok)q.set('image',input.value.trim());
    if(popup.checked)q.set('popup','1');
    for(const [el,file] of [[config,'ifywnx-Locket-Config.conf'],[module,'ifywnx-Locket-Captions.sgmodule']]){
      el.href=ok?base+file+'?'+q.toString():'#';
      el.setAttribute('aria-disabled',String(!ok));
    }
    dns.href=base+'ifywnx-Locket-DNS.mobileconfig';
  }
  buttons.forEach(b=>b.addEventListener('click',()=>{theme=b.dataset.id||'original';update()}));
  input.addEventListener('input',update);
  popup.addEventListener('change',update);
  update();
})();
</script>
</body>
</html>`;
  return new Response(html, {
    headers: { ...secureHeaders, 'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Security-Policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src https://i.ibb.co; base-uri 'none'; form-action 'none'",
    }
  });
}
