

if (process.argv.length > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log("added", result.name, "number:", result.number, "to phonebook");
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    for (const person of result) {
      console.log(person.name, person.number);
    }
    mongoose.connection.close();
  });
}
