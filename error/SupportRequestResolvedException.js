class EmptyException extends Error {
  constructor(field) {
    super()
    this.message = 'Support request resolved already.'
    this.field = field
    this.name = 'SupportRequestResolvedException'
  }
}

module.exports = EmptyException;
