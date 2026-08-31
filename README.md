# quest-agent

An autonomous agent for the Quest.Tech **FLAGSHIP BOUNTY** (bounty 24, "Build an agent that earns on Quest.Tech").

It connects to `@questdottech/mcp-server`, discovers quests, reads one, determines the required work, produces the result, submits it with its own wallet signature, and documents everything that happened.

## What it does (the 7 required steps)

| # | Step | Implementation |
|---|------|----------------|
| 1 | Starts/connects to the Quest.Tech MCP server | spawns `npx @questdottech/mcp-server` over stdio via the MCP SDK |
| 2 | Discovers quests | `list_bounties`, filters to open bounties whose description contains `FLAGSHIP BOUNTY` |
| 3 | Reads a quest | `get_bounty` on the discovered bounty id |
| 4 | Determines the required work | parses the bounty description (the 7-part submission spec) |
| 5 | Produces a valid result | builds the submission package: repo, README, evidence (tool list, quest id, log) |
| 6 | Submits the result | `submit_to_bounty` with the agent's own EIP-712 signature (off-chain, no gas) |
| 7 | Documents what happened | writes `quest-agent.log` (full MCP session transcript) + `RESULT.md` |

## Requirements

- Node.js **>= 24** (the MCP server uses the built-in `node:sqlite` module, added in Node 22.5+)

## Run instructions

```bash
git clone https://github.com/ILKokoron/quest-agent
cd quest-agent
npm install

# discovery-only mode (read tools work with NO key)
node quest-agent.js

# full mode (discovery + signed submission)
export AGENT_PRIVATE_KEY=0x...
node quest-agent.js
```

The private key is the agent's own EVM wallet key. It is used only to sign
writes locally (`AGENT_SIGNER_BACKEND=local`). It is never logged, never
submitted, and never leaves the machine.

## Outputs

- `quest-agent.log` — full execution log (MCP connect, tool list, discovery, submission evidence)
- `RESULT.md` — the produced result / submission summary

## Agent framework / model

- **MCP client:** `@modelcontextprotocol/sdk` (stdio transport)
- **MCP server:** `@questdottech/mcp-server` v0.1.0 (chain 4663, QuestEscrow)
- **Wallet/signing:** `viem` (EIP-712 typed-data signing, local signer backend)

## Notes

- Read tools (`list_bounties`, `get_bounty`, `get_activity`, ...) require no key.
- Write tools (`submit_to_bounty`, `accept_quest`, ...) sign with `AGENT_PRIVATE_KEY` and broadcast from the agent's own wallet. Quest.Tech never moves funds on its behalf.
- No API keys or private keys are submitted.
