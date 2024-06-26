class InvalidFieldException extends Error {
  constructor(field) {
    super()
    this.message = 'Field is invalid'
    this.field = field
    this.name = 'InvalidFieldLengthException'
  }
}

module.exports = InvalidFieldException
