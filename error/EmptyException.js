class EmptyException extends Error {
  constructor(message) {
    super(message)
    this.name = 'EmptyException' 
  }
}

module.exports = EmptyException

