const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://melmayan:${password}@cluster0.jyemsru.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const name = process.argv[3];
const num = process.argv[4];

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    if (name === undefined) {
      console.log("Phonebook :");
      Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log(person.name, person.number);
        });
        mongoose.connection.close();
      });
    } else {
      const person = new Person({
        name: name,
        number: num,
      });
      person.save().then(() => {
        console.log(`added ${name} number ${num} to phonebook`);
        mongoose.connection.close();
      });
    }
  })
  .catch((err) => console.log(err));
