const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const MessageClassifier = require('../src/MessageClassifier');
const UnsubscribeMessageHandler = require('../src/handlers/UnsubscribeMessageHandler');


describe('UnsubscribeMessageHandler', function () {
  const classifier = new MessageClassifier('unsubscribe');

  async function run (toAddress, found = true) {
    const calls = [];
    const database = {
      async unsubscribeAddress (...args) {
        calls.push(args);
        return found;
      }
    };
    const handler = new UnsubscribeMessageHandler(null, database, null, classifier);
    const result = await handler.processMessage({
      fromAddress: 'a@example.com',
      headers: new Map(),
      toAddress
    });
    return { calls, result };
  }

  it('should pass the mailing number to the database', async function () {
    const { calls, result } = await run('noreply+unsubscribe-42@example.com');
    assert.deepEqual(calls, [['a@example.com', 42]]);
    assert.deepEqual(result.performedActions, ['unsubscribe']);
  });

  it('should call the database without number for the plain address', async function () {
    const { calls } = await run('noreply+unsubscribe@example.com');
    assert.deepEqual(calls, [['a@example.com', undefined]]);
  });
});
