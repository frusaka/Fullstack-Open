import { useState, useEffect } from "react";
import personsService from "./services/persons";

import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import Filter from "./components/Filter";
import Notification from "./components/Notification";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [feedback, setFeedback] = useState({ message: null, success: true });

  useEffect(() => {
    personsService.getAll().then((contacts) => setContacts(contacts));
  }, []);

  const visibleContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(filter.toLowerCase())
  );

  const notify = (obj) => {
    setFeedback(obj);
    setTimeout(() => setFeedback({ message: null, success: true }), 3000);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={feedback.message} success={feedback.success} />
      <Filter value={filter} setter={setFilter} />
      <h2>New Contact</h2>
      <ContactForm
        fields={{ newName, newNumber, contacts }}
        setters={{ setNewName, setNewNumber, setContacts, setFeedback }}
        notify={notify}
      />
      <h2>Numbers</h2>
      <ContactList
        contacts={visibleContacts}
        setContacts={setContacts}
        notify={notify}
      ></ContactList>
    </div>
  );
};

export default App;
