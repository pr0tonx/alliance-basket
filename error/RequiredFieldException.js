class RequiredFieldException extends Error {
  constructor(field) {
    super()
    this.message = 'Field is required' 
    this.field = field 
    this.name = 'RequiredFieldException'
  }
}

module.exports = RequiredFieldException 

