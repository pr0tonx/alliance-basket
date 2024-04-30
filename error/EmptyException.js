class EmptyException extends Error {
  constructor(message) {
    super()
    this.message = message 
    this.name = 'EmptyException' 
  }
}

module.exports = EmptyException

