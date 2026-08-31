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
const winner = process.argv[3] || process.env.AGENT_ADDRESS;
const win = await client.callTool({
  name: 'select_winner',
  arguments: { bountyId: BID, winner },
});
console.log(JSON.stringify(win, null, 2));
process.exit(0);
