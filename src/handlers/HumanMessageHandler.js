class Email {
  constructor (parameters) {
    this.attachments = parameters.attachments;
    this.headers = parameters.headers || {};
    this.html = parameters.html;
    this.receivers = parameters.receivers;
    this.replyTo = parameters.replyTo;
    this.text = parameters.text;
    this.subject = parameters.subject;
  }
}


class HumanMessageHandler {
  constructor (logger, mailSender, config) {
    this.logger = logger;
    this.mailSender = mailSender;

    this.forwardTo = config.forwardTo;
    this.maxForwardDays = config.maxForwardDays;
  }

  async processMessage (message) {
    const actions = [];
    const age = Math.floor((Date.now() - new Date(message.date).getTime()) / 86400000);
    const notOld = (age <= this.maxForwardDays);

    if (notOld && this.forwardTo) {
      await this._forwardMessage(message);
      actions.push(`forwarded to ${this.forwardTo}`);
    }

    return {
      performedActions: actions,
      reason: `Human message${notOld ? '' : ', too old'}`,
      skipped: false
    };
  }

  // Письмо собирается заново, поэтому заголовки оригинала (From, Date,
  // Message-ID, Received) теряются: оригинал целиком прикладывается вложением
  async _forwardMessage (message) {
    const attachments = [...(message.attachments || [])];
    if (message.source) {
      attachments.push({
        content: message.source,
        contentDisposition: 'attachment',
        contentType: 'message/rfc822',
        filename: 'original.eml'
      });
    }
    await this.mailSender.sendEmail(new Email({
      attachments,
      headers: {},
      html: message.html,
      receivers: [{
        email: this.forwardTo
      }],
      replyTo: message.replyToAddress || message.fromAddress,
      subject: 'Fwd: ' + message.subject,
      text: message.text
    }));
  }
}

module.exports = HumanMessageHandler;
