import { useState, useEffect } from "react";
import axios from "axios";

import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import Filter from "./components/Filter";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setContacts(response.data);
    });
  }, []);

  const visibleContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} setter={setFilter}></Filter>
      <h2>New Contact</h2>
      <ContactForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        contacts={contacts}
        setContacts={setContacts}
      />
      <h2>Numbers</h2>
      <ContactList contacts={visibleContacts}></ContactList>
    </div>
  );
};

export default App;
