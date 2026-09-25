import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const content = await readFile(new URL('../app/content-data.ts', import.meta.url), 'utf8');
const requiredEntries = ['calculator', 'audit', 'map', 'templates', 'guide'];
const requiredOffers = ['free-trial', 'ofa-challenge', 'three-months', 'plr-funnels', 'all-in'];
for (const key of requiredEntries) assert.match(content, new RegExp(`key: '${key}'`), `missing entry ${key}`);
for (const key of requiredOffers) assert.match(content, new RegExp(`'${key}':`), `missing offer ${key}`);
for (const tag of ['Entry - Calculator', 'Entry - Audit', 'Entry - Map', 'Entry - Templates', 'Entry - Guide']) assert.match(content, new RegExp(tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing tag ${tag}`);
assert.match(await readFile(new URL('../app/api/leads/route.ts', import.meta.url), 'utf8'), /sequence_enrollments/);
assert.match(await readFile(new URL('../app/admin/sequences/page.tsx', import.meta.url), 'utf8'), /Pause all sends/);
console.log('affiliate-funnel-os config checks passed');
