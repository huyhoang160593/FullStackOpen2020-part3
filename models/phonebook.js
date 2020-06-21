const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB_URI

mongoose.connect(url,{ useNewUrlParser:true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MondoDB',error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type:String,
    require:true,
    minlength:3,
    unique:true
  },
  number: {
    type:String,
    minlength:8,
    require:true
  },
  date: Date
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

phonebookSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Phonebook',phonebookSchema)