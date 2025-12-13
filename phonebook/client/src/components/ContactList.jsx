import Contact from "./Contact";

const ContactList = ({ contacts, setContacts, notify }) => (
  <div>
    {contacts.map((contact) => (
      <Contact
        contact={contact}
        key={contact.id}
        setContacts={setContacts}
        notify={notify}
      ></Contact>
    ))}
  </div>
);

export default ContactList;
