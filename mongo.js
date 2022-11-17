const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  // eslint-disable-next-line no-undef
  process.exit(1)
}

// eslint-disable-next-line no-undef
const password = process.argv[2]

const url = `mongodb+srv://melmayan:${password}@cluster0.jyemsru.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// eslint-disable-next-line no-undef
const name = process.argv[3]
// eslint-disable-next-line no-undef
const num = process.argv[4]

mongoose
  .connect(url)
  .then(() => {
    console.log('connected')

    if (name === undefined) {
      console.log('Phonebook :')
      Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
    } else {
      const person = new Person({
        name: name,
        number: num,
      })
      person.save().then(() => {
        console.log(`added ${name} number ${num} to phonebook`)
        mongoose.connection.close()
      })
    }
  })
  .catch((err) => console.log(err))
