import fs from 'node:fs';import {build} from '../node_modules/esbuild/lib/main.js';import {ESLint} from '../node_modules/eslint/lib/api.js';
const root='G:/Meu Drive/site-reformulando-gx/GX Smart';
const files=['src/live-premium.js','src/marketplace-fallback-motion.js','src/services3d.js','src/components.js'];
const globals=Object.fromEntries(['window','document','matchMedia','Image','requestAnimationFrame','cancelAnimationFrame','ResizeObserver','IntersectionObserver','addEventListener','fetch'].map(k=>[k,'readonly']));
const lint=new ESLint({cwd:root,overrideConfigFile:true,overrideConfig:[{languageOptions:{ecmaVersion:'latest',sourceType:'module',globals},rules:{'no-unused-vars':'error','no-undef':'error'}}]});
const results=await lint.lintFiles(files);console.log(await(await lint.loadFormatter('stylish')).format(results));if(results.some(r=>r.errorCount))process.exitCode=1;
const result=await build({absWorkingDir:root,entryPoints:['src/main.js'],bundle:true,format:'esm',outdir:'verification-build',write:false,loader:{'.woff2':'file','.png':'file','.svg':'file'},logLevel:'silent'});console.log('Source bundle check:',result.outputFiles.length,'outputs; existing dist preserved');
for(const f of ['dist/assets/index-CBogC_Xj.js','dist/assets/services3d-C0txMUkZ.js'])await build({stdin:{contents:fs.readFileSync(root+'/'+f,'utf8'),loader:'js'},write:false,logLevel:'silent'});
console.log('Compiled modules syntax: OK');

