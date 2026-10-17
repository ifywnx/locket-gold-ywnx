#!/usr/bin/env node
// Read local video tracks only. Never uploads the files.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const paths=process.argv.slice(2);
if(!paths.length){console.error('Usage: node check-video-audio.mjs sender.mp4 [receiver.mp4]');process.exit(2)}
const results=[];
for(const filename of paths){
 if(!fs.existsSync(filename)){console.error('Không tìm thấy: '+filename);process.exitCode=2;continue}
 const proc=spawnSync('ffprobe',['-v','error','-show_entries','format=duration:stream=index,codec_type,codec_name,channels,sample_rate','-of','json',filename],{encoding:'utf8'});
 if(proc.error?.code==='ENOENT'){console.error('Thiếu ffprobe: brew install ffmpeg');process.exit(2)}
 if(proc.status!==0){console.error('ffprobe failed: '+String(proc.stderr).slice(0,400));process.exitCode=1;continue}
 const data=JSON.parse(proc.stdout);const tracks=data.streams||[];
 const audio=tracks.filter(x=>x.codec_type==='audio');
 const result={file:filename,videoTracks:tracks.filter(x=>x.codec_type==='video').length,audioTracks:audio.length,audioCodecs:audio.map(x=>x.codec_name),channels:audio.map(x=>x.channels),durationSeconds:Number(data.format?.duration||0)};
 console.log(JSON.stringify(result,null,2));results.push(result);
}
if(results.length>=2){
 const [a,b]=results;
 console.log(!a.audioTracks?'File gửi không có audio track: kiểm tra ghi âm/mã hóa.':
  !b.audioTracks?'File gửi có audio track, file nhận không có: kiểm tra upload/transcode/download.':
  'Cả hai có audio track: kiểm tra nội dung track, mute và trình phát.');
}
