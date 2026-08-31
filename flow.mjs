import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const transport = new StdioClientTransport({ command: 'npx', args: ['@questdottech/mcp-server'], cwd: '/root/quest-agent' });
const client = new Client({ name: 'qa', version: '1.0.0' });
await client.connect(transport);
// full tool list schemas for the flow tools
const tools = await client.listTools();
for (const t of tools.tools) {
  if (['post_bounty','accept_quest','submit_delivery','approve_delivery','select_winner','get_my_work','get_my_bounties'].includes(t.name)) {
    console.log('### ' + t.name);
    console.log(JSON.stringify(t.inputSchema, null, 1));
  }
}
process.exit(0);
