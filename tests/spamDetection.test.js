const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { createSpamDetector } = require('../src/spamDetection');


// Diagnostic-Code из реальных отказов: письмо отвергнуто из-за содержимого,
// репутации или аутентификации отправителя, а не потому, что нет ящика
const rejectedAsSpam = {
  gmail: 'smtp; 550-5.7.1 [209.85.220.41] Our system has detected that this message is ' +
    'likely unsolicited mail. To reduce the amount of spam sent to Gmail, this message ' +
    'has been blocked.',
  gmailUnauthenticated: 'smtp; 550-5.7.26 This mail has been blocked because the sender ' +
    'is unauthenticated. Gmail requires all senders to authenticate with either SPF or DKIM.',
  mailru: 'smtp; 550 spam message rejected. Please visit https://help.mail.ru/notspam-support',
  microsoft: 'smtp; 550 5.7.1 Service unavailable, Client host [203.0.113.5] blocked ' +
    'using Spamhaus.',
  microsoftReputation: 'smtp; 550 5.7.708 Service unavailable. Access denied, traffic not ' +
    'accepted from this IP. Low reputation of the sending IP address.',
  yandex: 'smtp; 554 5.7.1 [2] Message rejected under suspicion of SPAM; https://ya.cc/1IrBc'
};

const addressProblems = {
  gmailNoUser: 'smtp; 550-5.1.1 The email account that you tried to reach does not exist.',
  mailboxFull: 'smtp; 552 5.2.2 Mailbox full',
  relayDenied: 'smtp; 554 5.7.1 <user@example.com>: Relay access denied',
  unknownUser: 'smtp; 550 5.1.1 <user@example.com>: Recipient address rejected: ' +
    'User unknown in virtual mailbox table',
  yandexNoUser: 'smtp; 550 5.7.1 No such user!'
};

describe('spamDetection', () => {
  const isSpam = createSpamDetector();

  for (const [name, code] of Object.entries(rejectedAsSpam)) {
    it(`should detect a rejection as spam: ${name}`, () => {
      assert.equal(isSpam(code), true);
    });
  }

  for (const [name, code] of Object.entries(addressProblems)) {
    it(`should not take an address problem for spam: ${name}`, () => {
      assert.equal(isSpam(code), false);
    });
  }

  it('should not fail without a Diagnostic-Code', () => {
    assert.equal(isSpam(undefined), false);
    assert.equal(isSpam(''), false);
  });

  it('should use patterns from the config instead of the default ones', () => {
    const custom = createSpamDetector(['rejected by policy']);
    assert.equal(custom('550 5.7.1 Message REJECTED BY POLICY'), true);
    assert.equal(custom(rejectedAsSpam.yandex), false);
  });
});
