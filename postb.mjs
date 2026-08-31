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
const post = await client.callTool({
  name: 'post_bounty',
  arguments: {
    mode: 'open',
    title: 'E2E proof: quest-agent full lifecycle',
    description: [
      'Created by quest-agent (repo ' + REPO + '), the autonomous agent built for FLAGSHIP BOUNTY 24.',
      'Goal: prove one full Quest.Tech lifecycle on-chain.',
      'Flow: create open bounty (USDG locked in escrow) -> worker submits signed delivery -> creator selects winner -> funds released.',
      'All evidence on Robinhood Chain 4663.',
    ].join('\n'),
    category: 'other',
    participantPolicy: 'everyone',
    asset: 'ETH',
    amount: '0.0001',
    deadlineDays: 7,
  },
});
console.log(JSON.stringify(post, null, 2));
process.exit(0);
