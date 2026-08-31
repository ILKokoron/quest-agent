import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const transport = new StdioClientTransport({ command: 'npx', args: ['@questdottech/mcp-server'], cwd: '/root/quest-agent' });
const client = new Client({ name: 'qa', version: '1.0.0' });
await client.connect(transport);
const r = await client.callTool({ name: 'get_submissions', arguments: { bountyId: 24 } });
console.log(JSON.stringify(r, null, 2));
process.exit(0);
