import test from 'node:test';
import assert from 'node:assert/strict';
import {trees, allSkills, parseAge, unlockedSkills, hasLegendary} from '../src/skills.js';
test('share links clamp and normalize age safely',()=>{
  for (const value of [null,undefined,'','garbage','Infinity']) assert.equal(parseAge(value),45);
  assert.equal(parseAge('-5'),20); assert.equal(parseAge('1000'),80); assert.equal(parseAge('44.7'),45);
});
test('unlock boundaries and legendary synergy',()=>{
  assert.equal(unlockedSkills(20).length,0);
  assert.equal(unlockedSkills(80).length,allSkills.length);
  for(const skill of allSkills){assert.ok(!unlockedSkills(skill.age-1).includes(skill));assert.ok(unlockedSkills(skill.age).includes(skill));}
  assert.equal(hasLegendary(44),false);assert.equal(hasLegendary(45),true);
});
test('expandable content has unique IDs and valid earlier parents',()=>{
  assert.equal(new Set(allSkills.map(s=>s.id)).size,allSkills.length);
  for(const tree of trees) for(const [index,skill] of tree.skills.entries()){
    assert.ok(skill.age>=20 && skill.age<=80);
    for(const id of skill.parents){const parentIndex=tree.skills.findIndex(s=>s.id===id);assert.ok(parentIndex>=0 && parentIndex<index);assert.ok(tree.skills[parentIndex].age<=skill.age);}
  }
});
