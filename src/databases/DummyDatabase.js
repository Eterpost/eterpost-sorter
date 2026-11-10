class DummyDatabase {
  constructor (_, logger) {
    this.logger = logger;
  }

  disableEmailsForAddress (address) {
    this.logger.debug(`DummyDatabase: disabling address ${address} in mailing DB`);
    return true;
  }

  unsubscribeAddress (address, mailingId) {
    this.logger.debug(
      `DummyDatabase: unsubscribing address ${address} in mailing DB (mailing ${mailingId})`
    );
    return true;
  }
}

module.exports = DummyDatabase;
