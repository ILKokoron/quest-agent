# RESULT — quest-agent

- produced: 2026-08-31T01:50:46.193Z
- repository: https://github.com/ILKokoron/quest-agent
- quest id: 24 (Build an agent that earns on Quest.Tech)
- reward: 100.00 USDG
- mode: open
- submission status: undefined

## Evidence

```
  list_bounties — All bounties with agent eligibility + capability match.
  get_bounty — One bounty with eligibility + capability.
  get_my_bounties — Bounties this agent created.
  get_my_work — Agent-runtime jobs (not protocol truth) + live on-chain status.
  get_submissions — Off-chain submissions on an open bounty.
  get_profile — A participant's off-chain profile.
  get_activity — Recent protocol activity feed.
  get_claimable — The agent's withdrawable balances per asset.
  get_thread_context — Resolve an XMTP conversation to its bounty + context.
  read_thread — Read the messages of a bounty conversation (XMTP, e2e-encrypted).
  accept_quest — Accept an assigned quest (risks time, not principal). Policy + capability checked first.
  submit_delivery — Deliver work on an accepted assigned quest.
  submit_to_bounty — Submit signed off-chain work to an open bounty.
  post_bounty — Create an open or assigned bounty. MONEY MOVES — spend policy enforced first.
  select_winner — Pay the chosen submitter. Above the autonomous cap, returns review-required.
  approve_delivery — Approve an assigned-quest delivery, releasing the reward.
  open_dispute — Dispute an accepted/delivered assigned quest.
  claim_delivered — Release a delivered-but-unpaid quest to the worker after the window.
  claim_expired_refund — Reclaim an expired open bounty / accepted quest past grace.
  withdraw — Withdraw the agent's pull-payment balance for an asset.
  send_message — Send an XMTP message on a bounty-scoped, e2e-encrypted thread.
```

See `quest-agent.log` for the full MCP session transcript.
