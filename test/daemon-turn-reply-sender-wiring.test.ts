import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const daemonSource = readFileSync(join(__dirname, '..', 'src', 'daemon.ts'), 'utf8');

describe('daemon per-turn reply sender wiring', () => {
  it('binds the accepted sender on passthrough, new-topic, existing-session and auto-create paths', () => {
    expect(daemonSource).toMatch(/beginReplyTargetTurn\(ds, turn\.replyRootId,[\s\S]{0,300}senderOpenId: turn\.senderOpenId/);
    expect(daemonSource).toContain('beginReplyTargetTurn(ds, replyRootId, messageId, new Date().toISOString(), { senderOpenId });');
    expect(daemonSource).toMatch(/beginReplyTargetTurn\(ds, replyRootId, messageId,[^\n]+senderOpenId \}\);/);
    expect(daemonSource).toMatch(/beginReplyTargetTurn\(ds, replyRootId, parsed\.messageId,[^\n]+senderOpenId: callerOpenId \}\);/);
    expect(daemonSource).toMatch(/beginReplyTargetTurn\(newDs, replyRootId, parsed\.messageId,[^\n]+senderOpenId: senderOId \}\);/);
  });

  it('does not invent a sender for scheduled or system-created turns', () => {
    expect(daemonSource).toContain('beginReplyTargetTurn(ds, sharedReplyRootId, sharedReplyRootId, new Date(now).toISOString());');
  });
});
