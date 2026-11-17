import fs from 'node:fs';
import {renderHome} from '../src/render.js';
const path='index.html';
let html=fs.readFileSync(path,'utf8');
html=html.replace(/<div id="app">[\s\S]*?<\/div>\n  <script type="module"/, '<div id="app">'+renderHome()+'</div>\n  <script type="module"');
fs.writeFileSync(path,html);
