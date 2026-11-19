import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {dirname,join,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const safeTextTypes=new Set(['.html','.htm','.js','.mjs','.cjs','.css','.json','.svg','.md','.txt','.xml','.yml','.yaml','.toml','.sh','.ps1','.ts','.tsx','.jsx']);
const knownSafeEmailDomain=/^(?:example\.(?:com|org|net)|users\.noreply\.github\.com)$/i;
const rules=[
  ['private-key-block',/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  ['github-access-token',/\b(?:github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9_]{30,})\b/g],
  ['other-access-token',/\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{32,}|AKIA[A-Z0-9]{16}|AIza[0-9A-Za-z_-]{30,}|xox[baprs]-[A-Za-z0-9-]{20,})\b/g],
  ['personal-home-path',/(?:[A-Z]:[\\/]{1,2}(?:Users|Documents and Settings)[\\/]{1,2}[^\\/\s"'<>]+|\/(?:home|Users)\/[^\/\s"'<>]+)/gi],
  ['persistent-identifier',/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi],
  ['machine-hostname',/\b(?:DESKTOP|LAPTOP)-[A-Z0-9]{7,16}\b/g],
  ['database-connection',/\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis):\/\/[^\s"'<>]{12,}/gi],
  ['embedded-url-credential',/https?:\/\/[^\s/@:]+:[^\s/@]+@[^\s/]+/gi],
  ['hardcoded-credential',/\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password)\s*[:=]\s*["'][^"']{12,}["']/gi],
  ['device-identifier',/\b(?:device[_-]?id|machine[_-]?id|android[_-]?id|serial[_-]?number|imei)\s*[:=]\s*["'][A-Za-z0-9-]{12,}["']/gi],
  ['email-address',/\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}\b/g]
];
function textFile(file) {
  if(!existsSync(file)||statSync(file).size>2_500_000)return null;
  const buf=readFileSync(file);
  if(buf.includes(0))return null;
  return buf.toString('utf8');
}
function scan(file,logicalName){
  const contents=textFile(file);
  if(contents===null)return [];
  const errors=[];
  for(const [type,pattern] of rules){
    pattern.lastIndex=0;
    for(const match of contents.matchAll(pattern)){
      if(type==='email-address'){
        const domain=match[0].split('@').pop();
        if(knownSafeEmailDomain.test(domain))continue;
      }
      const line=contents.slice(0,match.index).split('\n').length;
      errors.push({file:logicalName,line,type});
    }
  }
  return errors;
}
function walk(dir,prefix,output){
  if(!existsSync(dir))return;
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    const abs=join(dir,entry.name);
    if(entry.isDirectory())walk(abs,prefix,output);
    else if(entry.isFile()){
      const n=relative(root,abs).replaceAll(sep,'/');
      if(safeTextTypes.has('.'+n.split('.').pop().toLowerCase()))output.push([abs,n]);
    }
  }
}
const tracked=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root}).toString('utf8').split('\0').filter(Boolean);
const files=tracked.map(n=>[join(root,n),n.replaceAll(sep,'/')]);
walk(join(root,'dist'),'dist',files);
let problems=[];
for(const [file,name] of files){
  if(/(?:^|\/)(?:\.env(?:\.[^/]+)?|id_rsa|id_ed25519|[^/]+\.(?:pem|p12|pfx))$/i.test(name) && !name.endsWith('.env.example')){
    problems.push({file:name,line:1,type:'sensitive-file-name'});
  }
  problems.push(...scan(file,name));
}
if(problems.length){
  console.error('Privacy check blocked publication. Inspect these locations locally; sensitive values are intentionally hidden:');
  for(const item of problems)console.error(item.file+':'+item.line+' ['+item.type+']');
  process.exitCode=1;
}else{
  console.log('Privacy check passed ('+files.length+' source and generated text files). No matches for the configured sensitive-data patterns.');
}
