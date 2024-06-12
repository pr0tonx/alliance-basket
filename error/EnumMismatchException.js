class EmptyException extends Error {
  constructor(field) {
    super()
    this.message = 'Enum options mismatch'
    this.field = field
    this.name = 'EnumMismatchException'
  }
}

module.exports = EmptyException;
