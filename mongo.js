const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://iulover99:${password}@myfirstcluster-fxxco.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date
})

const PhoneBook = mongoose.model('PhoneBook', phonebookSchema)

if(process.argv[3]){
    const phoneBook = new PhoneBook({
        name: process.argv[3],
        number: process.argv[4],
        date: new Date()
    })
    
    phoneBook.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
      })
}
if(process.argv.length===3){
    console.log('phonebook:')
    PhoneBook.find({}).then(result => {
        result.forEach(note => {
            console.log(`${note.name} ${note.number}`)
        })
        mongoose.connection.close()
    })
}
