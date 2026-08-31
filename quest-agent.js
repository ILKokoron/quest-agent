#!/usr/bin/env node
/**
 * quest-agent — autonomous Quest.Tech agent (FLAGSHIP BOUNTY 24).
 *
 * Full lifecycle: connect -> discover -> read -> determine -> produce ->
 * submit -> document. Discovery-only when AGENT_PRIVATE_KEY is unset
 * (read tools need no key); discovery + signed submission when set.
 *
 *   node quest-agent.js
 *   AGENT_PRIVATE_KEY=0x... node quest-agent.js
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG = resolve(__dirname, 'quest-agent.log');
const RESULT = resolve(__dirname, 'RESULT.md');
const REPO = 'https://github.com/ILKokoron/quest-agent';

const log = (s) => {
  const line = `[${new Date().toISOString()}] ${s}`;
  console.log(line);
  writeFileSync(LOG, line + '\n', { flag: 'a' });
};

async function main() {
  const started = new Date().toISOString();
  log('=== QUEST AGENT BOOT ===');
  log(`repo: ${REPO}`);
  log(`signing mode: ${process.env.AGENT_PRIVATE_KEY ? 'FULL (discovery + submit)' : 'DISCOVERY-ONLY (no key)'}`);

  // ---- 1. connect ----
  log('connecting to @questdottech/mcp-server (stdio)...');
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['@questdottech/mcp-server'],
    cwd: __dirname,
    env: { ...process.env }, // forward AGENT_PRIVATE_KEY + config to the server
  });
  const client = new Client({ name: 'quest-agent', version: '1.0.0' });
  await client.connect(transport);
  log('connected.');

  // ---- 2. discover ----
  log('STEP 2: discovering quests (list_bounties)...');
  const list = await client.callTool({ name: 'list_bounties', arguments: {} });
  const listText = list.content.map((c) => c.text).join('\n');
  let bounties = [];
  try { bounties = JSON.parse(listText); } catch { log('bounties not pure JSON, skipping parse'); }
  if (!Array.isArray(bounties)) bounties = (bounties.bounties || bounties.quests || []);
  log(`found ${bounties.length} bounties total.`);

  // autonomous target selection: open bounties with FLAGSHIP BOUNTY in description
  const flagships = bounties.filter(
    (b) => b.status === 'open' && /FLAGSHIP BOUNTY/i.test(b.description || '')
  );
  const target = flagships[0] || bounties.find((b) => b.status === 'open');
  const targetId = target ? target.bountyId ?? target.id : null;
  log(`STEP 2 done. target bounty: ${targetId} "${target?.title || 'n/a'}" (status ${target?.status})`);

  // ---- 3. read ----
  let requirements = '';
  let detail = {};
  if (targetId != null) {
    log(`STEP 3: reading bounty ${targetId} (get_bounty)...`);
    const d = await client.callTool({ name: 'get_bounty', arguments: { bountyId: Number(targetId) } });
    detail = d.structuredContent || {};
    requirements = detail.description || '';
    log(`STEP 3 done. reward ${detail.reward} ${detail.asset}, mode ${detail.mode}, submissions ${detail.submissionCount}`);
  } else {
    log('STEP 3 skipped: no open bounty found.');
  }

  // ---- 4. determine required work ----
  log('STEP 4: determining required work from description...');
  const work = requirements
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 14);
  log(`STEP 4 done. extracted ${work.length} requirement lines.`);

  // ---- 5. produce result ----
  log('STEP 5: producing result (repo + evidence)...');
  const tools = await client.listTools();
  const toolList = tools.tools.map((t) => `  ${t.name} — ${(t.description || '').split('\n')[0]}`).join('\n');
  const produced = {
    repo: REPO,
    questId: targetId,
    title: detail.title,
    reward: `${detail.reward} ${detail.asset}`,
    producedAt: new Date().toISOString(),
  };
  log(`STEP 5 done: ${JSON.stringify(produced)}`);

  // ---- 6. submit ----
  let submission = { status: 'skipped', note: 'AGENT_PRIVATE_KEY not set; discovery-only mode.' };
  if (process.env.AGENT_PRIVATE_KEY && targetId != null) {
    log('STEP 6: submitting result (submit_to_bounty, signed locally)...');
    const message = [
      'FLAGSHIP BOUNTY 24 — autonomous agent submission',
      '',
      '1. Repository URL',
      REPO,
      '',
      '2. README + run instructions',
      'README.md in repo. `npm install && node quest-agent.js` (Node >= 24, node:sqlite).',
      '',
      '3. Agent framework / model used',
      'MCP client (@modelcontextprotocol/sdk, stdio) + @questdottech/mcp-server v0.1.0. Wallet: viem EIP-712 local signer.',
      '',
      '4. MCP initialization + tools/list evidence',
      `connected over stdio, ${tools.tools.length} tools available:`,
      toolList,
      '',
      '5. The discovered quest ID',
      `bounty ${targetId} (${detail.title || 'n/a'})`,
      '',
      '6. The produced result + submission evidence',
      `repo ${REPO} — quest-agent.js (this agent), README.md, quest-agent.log (full MCP session transcript), RESULT.md.`,
      '',
      '7. Screenshots / logs',
      `quest-agent.log in the repo: connect, tool list, discovery, submission evidence.`,
    ].join('\n');
    try {
      submission = await client.callTool({
        name: 'submit_to_bounty',
        arguments: { bountyId: Number(targetId), message, contentURI: REPO },
      });
      log(`STEP 6 done: ${JSON.stringify(submission, null, 2)}`);
    } catch (e) {
      submission = { status: 'error', error: String(e && e.message || e) };
      log(`STEP 6 ERROR: ${submission.error}`);
    }
  } else {
    log(`STEP 6 ${submission.note}`);
  }

  // ---- 7. document ----
  log('STEP 7: writing RESULT.md...');
  const md = [
    '# RESULT — quest-agent',
    '',
    `- produced: ${started}`,
    `- repository: ${REPO}`,
    `- quest id: ${targetId} (${detail.title || 'n/a'})`,
    `- reward: ${detail.reward || 'n/a'} ${detail.asset || ''}`,
    `- mode: ${detail.mode || 'n/a'}`,
    `- submission status: ${submission.status}`,
    '',
    '## Evidence',
    '',
    '```',
    toolList,
    '```',
    '',
    'See `quest-agent.log` for the full MCP session transcript.',
    '',
  ].join('\n');
  writeFileSync(RESULT, md);
  log(`RESULT.md written (${RESULT}).`);
  log('=== QUEST AGENT COMPLETE ===');
  process.exit(submission.status === 'error' ? 1 : 0);
}

main().catch(async (err) => {
  log(`FATAL: ${err.stack || err}`);
  process.exit(1);
});
