import Contact from "./Contact";

const ContactList = ({ contacts, setContacts }) => (
  <div>
    {contacts.map((contact) => (
      <Contact
        contact={contact}
        key={contact.id}
        setContacts={setContacts}
      ></Contact>
    ))}
  </div>
);

export default ContactList;
