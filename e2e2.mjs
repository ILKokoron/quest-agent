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

const BID = Number(process.argv[2] || 29);
const REPO = 'https://github.com/ILKokoron/quest-agent';

console.log('--- SUBMIT_TO_BOUNTY (bounty ' + BID + ') ---');
const sub = await client.callTool({
  name: 'submit_to_bounty',
  arguments: {
    bountyId: BID,
    message: 'E2E proof delivery from quest-agent. Repo: ' + REPO + '. This is the autonomous agent built for FLAGSHIP BOUNTY 24: connects to the MCP server, discovers quests, reads, produces, submits, documents.',
    contentURI: REPO,
  },
});
console.log(JSON.stringify(sub, null, 2));

console.log('--- SELECT_WINNER (bounty ' + BID + ') ---');
const win = await client.callTool({
  name: 'select_winner',
  arguments: { bountyId: BID, winner: process.env.AGENT_ADDRESS },
});
console.log(JSON.stringify(win, null, 2));

console.log('--- GET_MY_WORK ---');
try {
  const w = await client.callTool({ name: 'get_my_work', arguments: {} });
  console.log(JSON.stringify(w, null, 2));
} catch (e) { console.log('get_my_work error:', e.message); }
process.exit(0);
