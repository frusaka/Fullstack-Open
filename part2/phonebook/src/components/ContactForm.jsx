import personsService from "../services/persons";

const ContactForm = ({
  contacts,
  newName,
  newNumber,
  setContacts,
  setNewName,
  setNewNumber,
}) => {
  const addContact = (event) => {
    event.preventDefault();

    for (const contact of contacts) {
      if (contact.name != newName) continue;
      if (
        !window.confirm(
          `${newName} is already added to phonebook. Replace the old number with a new one?`
        )
      )
        return;
      return personsService
        .update(contact.id, { ...contact, number: newNumber })
        .then(() =>
          personsService.getAll().then((persons) => setContacts(persons))
        );
    }

    if (!(newName && newNumber)) {
      return window.alert("Both the name and number fields must be filled");
    }
    personsService
      .create({
        name: newName,
        number: newNumber,
      })
      .then((person) => setContacts(contacts.concat(person)));
  };
  return (
    <form onSubmit={addContact}>
      <div>
        name:{" "}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default ContactForm;
