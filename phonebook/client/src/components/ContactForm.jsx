import personsService from "../services/persons";

const ContactForm = ({ fields, setters, notify }) => {
  const { newName, newNumber, contacts } = fields;
  const { setNewName, setNewNumber, setContacts } = setters;

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
        )
        .then(() =>
          notify({ message: `Updated ${newName}'s number`, success: true })
        )
        .catch((error) =>
          notify({ message: error.response.data.error, success: false })
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
      .then((person) => {
        notify({ message: `Added ${newName}`, success: true });
        setContacts(contacts.concat(person));
      })
      .catch((error) =>
        notify({ message: error.response.data.error, success: false })
      );
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
