class UnsubscribeMessageHandler {
  constructor (mailbox, mailingListDatabase, logger, classifier) {
    this.mailbox = mailbox;
    this.mailingListDatabase = mailingListDatabase;
    this.logger = logger;
    this.classifier = classifier;
  }

  async processMessage (message) {
    const mailingId = this.classifier &&
      this.classifier.getUnsubscribeMailingId(message);
    const suffix = mailingId ? ` (mailing ${mailingId})` : '';
    const found = await this.mailingListDatabase.unsubscribeAddress(message.fromAddress, mailingId);
    if (found) {
      return {
        performedActions: ['unsubscribe'],
        reason: 'Received unsubscribe email' + suffix,
        skipped: false
      };
    }

    return {
      performedActions: [],
      reason: 'Received unsubscribe email' + suffix + ', but found no address in database',
      skipped: false
    };
  }
}

module.exports = UnsubscribeMessageHandler;
