class UserExistsException extends Error {
  constructor(field) {
    super()
    this.message = 'User already exists' 
    this.field = field 
    this.name = 'UserExistsException'
  }
}

module.exports = UserExistsException 

