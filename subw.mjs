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
const BID = Number(process.argv[2] || 30);
const REPO = 'https://github.com/ILKokoron/quest-agent';
const sub = await client.callTool({
  name: 'submit_to_bounty',
  arguments: {
    bountyId: BID,
    message: 'E2E proof delivery from quest-agent worker wallet. Repo: ' + REPO + '. Full autonomous lifecycle demonstrated: create open bounty on-chain, submit signed delivery off-chain, select winner, escrow release.',
    contentURI: REPO,
  },
});
console.log(JSON.stringify(sub, null, 2));
process.exit(0);
