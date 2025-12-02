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
    if (contacts.some((contact) => contact.name == newName)) {
      return window.alert(`${newName} is already added to phonebook`);
    }
    if (!(newName && newNumber)) {
      return window.alert("Both the name and number fields must be filled");
    }
    setContacts(
      contacts.concat({
        name: newName,
        number: newNumber,
        id: contacts.length + 1,
      })
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
