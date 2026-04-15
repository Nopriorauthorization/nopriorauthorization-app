/**
 * Patches public/micro270/*.html once with:
 * - Session fingerprint + zero-width watermark on explanations (__wmEx + ${q.e} -> ${__wmEx(q.e)})
 * - Anti–copy-paste listeners (contextmenu, selectstart, keydown)
 * - Copyright / IP footer
 *
 * Idempotent: skips files that already contain __wmEx.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, "../../public/micro270");

const WATERMARK_BLOCK = `
var __MICRO270_FP=(function(){
  try{
    return btoa([navigator.userAgent.slice(0,20),screen.width+'x'+screen.height,new Date().toISOString().slice(0,10),Math.random().toString(36).slice(2,7)].join('|')).slice(0,12);
  }catch(e){
    return btoa('fp|fallback|'+Date.now()).slice(0,12);
  }
})();
function __wmEx(text){
  if(text==null||text==='')return text;
  var zwChars='\\u200b\\u200c\\u200d\\uFEFF';
  var fp=__MICRO270_FP;
  var bits=fp.split('').map(function(c){return c.charCodeAt(0).toString(2).padStart(8,'0');}).join('');
  var out='',i=0;
  for(var j=0;j<text.length;j++){
    out+=text[j];
    if(i<bits.length)out+=zwChars[parseInt(bits[i++],10)%4];
  }
  return out;
}
`.trim();

const ANTI_COPY_SCRIPT = `
<script>
(function(){
  document.addEventListener('contextmenu',function(e){e.preventDefault();});
  document.addEventListener('selectstart',function(e){
    if(e.target.closest('.qcard'))e.preventDefault();
  });
  document.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&['a','c','s','p','u'].indexOf(e.key.toLowerCase())!==-1){
      if(e.target.closest('.qcard,.grid'))e.preventDefault();
    }
  });
})();
</script>
`.trim();

const FOOTER = `
<footer class="micro270-ip-footer" style="margin-top:2rem;padding:1rem 1.25rem;font-size:11px;line-height:1.5;color:rgba(255,255,255,0.45);text-align:center;border-top:1px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.25);">
  © ${new Date().getFullYear()} Danielle Alcala-Glazier / No Prior Authorization. All questions, explanations, and study content are original intellectual property. Personal use only — no reproduction, redistribution, commercial use, or use for training AI systems. See <a href="https://nopriorauthorization.com/terms" style="color:#c77b2a;">Terms of Use</a>.
</footer>
`.trim();

function patchFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  if (html.includes("__wmEx")) {
    console.log("skip (already patched):", path.basename(filePath));
    return;
  }
  if (!html.includes("${q.e}")) {
    console.warn("no ${q.e} found:", path.basename(filePath));
    return;
  }
  const renderIdx = html.indexOf("function render");
  if (renderIdx === -1) {
    console.warn("no function render:", path.basename(filePath));
    return;
  }
  const inject = `\n${WATERMARK_BLOCK}\n`;
  html = html.slice(0, renderIdx) + inject + html.slice(renderIdx);
  html = html.replaceAll("${q.e}", "${__wmEx(q.e)}");

  if (!html.includes("micro270-ip-footer")) {
    const bodyClose = html.lastIndexOf("</body>");
    if (bodyClose === -1) {
      console.warn("no </body>:", path.basename(filePath));
      return;
    }
    html =
      html.slice(0, bodyClose) +
      "\n" +
      FOOTER +
      "\n" +
      ANTI_COPY_SCRIPT +
      "\n" +
      html.slice(bodyClose);
  }

  fs.writeFileSync(filePath, html, "utf8");
  console.log("patched:", path.basename(filePath));
}

const files = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith(".html"));
for (const f of files) {
  patchFile(path.join(DIR, f));
}
