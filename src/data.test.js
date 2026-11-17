import test from 'node:test';
import assert from 'node:assert/strict';
import {buildContactUrl,projects} from './data.js';
test('briefing preserves special characters without adding query parameters',()=>{
  const url=new URL(buildContactUrl({name:'João & Maria',email:'a+b@example.com',phone:'11999999999',service:'Design',message:'Olá? #ideia & criação'}));
  assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/5511977085852');
  assert.equal([...url.searchParams.keys()].length,1);assert.match(url.searchParams.get('text'),/Olá\? #ideia & criação/);
});
test('portfolio retains six distinct original projects',()=>{assert.equal(projects.length,6);assert.equal(new Set(projects.map(p=>p.url)).size,6);projects.forEach(p=>assert.equal(new URL(p.url).protocol,'https:'));});
