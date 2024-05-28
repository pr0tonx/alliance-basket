
class InvalidFieldException extends Error {
  constructor(field) {
    super()
    this.message = 'Not allowed to perform such action due to lack of privileges.'
    this.field = field
    this.name = 'NotAllowedException'
  }
}

module.exports = InvalidFieldException
