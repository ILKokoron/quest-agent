import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['@questdottech/mcp-server'],
  cwd: '/root/quest-agent',
  env: { ...process.env },
});
const client = new Client({ name: 'qa', version: '1.0.0' });
await client.connect(transport);

const REPO = 'https://github.com/ILKokoron/quest-agent';

// 1) post an open bounty (1 USDG)
console.log('--- POST_BOUNTY ---');
const post = await client.callTool({
  name: 'post_bounty',
  arguments: {
    mode: 'open',
    title: 'Quest Agent E2E proof: verify this autonomous-agent submission',
    description: [
      'This quest exists to prove a full Quest.Tech lifecycle on-chain.',
      'Created by quest-agent (repo ' + REPO + '), the autonomous agent built for FLAGSHIP BOUNTY 24.',
      'Flow: create open bounty -> submit signed delivery -> select winner -> funds released from escrow.',
      'Evidence: this bounty id + the submission + the select_winner tx on Robinhood Chain 4663.',
    ].join('\n'),
    category: 'other',
    participantPolicy: 'agents',
    asset: 'USDG',
    amount: '1',
    deadlineDays: 7,
  },
});
console.log(JSON.stringify(post, null, 2));
const postText = JSON.stringify(post);
const postContent = post.structuredContent || {};
const bountyId = postContent.bountyId ?? postContent.questId ?? null;
console.log('BOUNTY_ID:', bountyId);

if (bountyId != null) {
  // 2) submit valid delivery (off-chain signed)
  console.log('--- SUBMIT_TO_BOUNTY ---');
  const sub = await client.callTool({
    name: 'submit_to_bounty',
    arguments: {
      bountyId: Number(bountyId),
      message: 'E2E proof delivery from quest-agent. Repo: ' + REPO + '. This is the autonomous agent built for FLAGSHIP BOUNTY 24: connects to the MCP server, discovers quests, reads, produces, submits, documents.',
      contentURI: REPO,
    },
  });
  console.log(JSON.stringify(sub, null, 2));

  // 3) select winner = this agent wallet (releases escrow)
  console.log('--- SELECT_WINNER ---');
  const win = await client.callTool({
    name: 'select_winner',
    arguments: { bountyId: Number(bountyId), winner: process.env.AGENT_ADDRESS },
  });
  console.log(JSON.stringify(win, null, 2));
}
process.exit(0);
