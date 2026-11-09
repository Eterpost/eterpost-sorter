// Шаблоны Diagnostic-Code, по которым отказ считается отказом из-за самого
// письма или отправителя (спам, списки блокировки, репутация, SPF/DKIM/DMARC),
// а не из-за адреса. Такой адрес не исключается из рассылок: ящик существует.
// Регулярные выражения, без учёта регистра; переопределяются параметром
// spamPatterns в конфигурации
const DEFAULT_SPAM_PATTERNS = [
  '\\bspam',
  'unsolicited',
  'blocked using',
  '\\b(?:block|black|deny)\\s?list',
  '\\b(?:dnsbl|rbl)\\b',
  'reputation',
  '\\b(?:spf|dkim|dmarc)\\b',
  'unauthenticated|not authenticated'
];

/**
 * Возвращает функцию (diagnosticCode) => boolean: отвергнуто ли письмо как спам
 */
function createSpamDetector (patterns = DEFAULT_SPAM_PATTERNS) {
  const regexps = patterns.map(pattern => new RegExp(pattern, 'i'));
  return diagnosticCode => Boolean(diagnosticCode) &&
    regexps.some(regexp => regexp.test(diagnosticCode));
}

module.exports = { DEFAULT_SPAM_PATTERNS, createSpamDetector };
