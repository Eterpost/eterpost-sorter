const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const MessageClassifier = require('../src/MessageClassifier');
const MessageTypes = require('../src/MessageTypes');


function message (toAddress) {
  return { headers: new Map(), toAddress };
}

describe('MessageClassifier', function () {
  const classifier = new MessageClassifier('unsubscribe');

  it('should recognise a numbered unsubscribe address', function () {
    const msg = message('noreply+unsubscribe-42@example.com');
    assert.equal(classifier.classifyMessage(msg), MessageTypes.UNSUBSCRIBE);
    assert.equal(classifier.getUnsubscribeMailingId(msg), 42);
  });

  it('should recognise a plain unsubscribe address without number', function () {
    const msg = message('noreply+unsubscribe@example.com');
    assert.equal(classifier.classifyMessage(msg), MessageTypes.UNSUBSCRIBE);
    assert.equal(classifier.getUnsubscribeMailingId(msg), undefined);
  });

  it('should be case-insensitive for the word', function () {
    const msg = message('noreply+UnSubscribe-7@example.com');
    assert.equal(classifier.classifyMessage(msg), MessageTypes.UNSUBSCRIBE);
    assert.equal(classifier.getUnsubscribeMailingId(msg), 7);
  });

  const notUnsubscribe = [
    'unsubscribe-x', 'unsubscribe-', 'unsubscribe-0', 'unsubscribe-4x', 'unsubscribe--1'
  ];
  for (const suffix of notUnsubscribe) {
    it(`should not treat ${suffix} as unsubscribe`, function () {
      const msg = message(`noreply+${suffix}@example.com`);
      assert.notEqual(classifier.classifyMessage(msg), MessageTypes.UNSUBSCRIBE);
      assert.equal(classifier.getUnsubscribeMailingId(msg), undefined);
    });
  }

  it('should not treat an address without plus as unsubscribe', function () {
    const msg = message('noreply@example.com');
    assert.equal(classifier.classifyMessage(msg), MessageTypes.HUMAN);
    assert.equal(classifier.getUnsubscribeMailingId(msg), undefined);
  });
});
