 'use client';
export default function Downloads({base}:{base:string}) {
 const url=base+'ifywnx-Locket-Captions.sgmodule';
 return <article><h3>Locket · ifywnx</h3><p>Bản Locket riêng, không kèm DNS, GPS hoặc module tổng hợp.</p><a className="button" href={'shadowrocket://install?module='+encodeURIComponent(url)}>Mở Shadowrocket để cài ↗</a><details><summary>Sao chép liên kết thủ công</summary><input aria-label="Liên kết module Locket" readOnly value={url} onFocus={e=>e.target.select()}/><small>Liên kết chứa mã riêng. Không chia sẻ lại.</small></details><p className="notice">Nếu đã cài bản cũ, gỡ hồ sơ DNS cũ và tắt All Apps, GPS, Sub-Store. Cài module mới không tự gỡ các thành phần đó.</p></article>;
}
