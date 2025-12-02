import Contact from "./Contact";

const ContactList = ({ contacts }) => (
  <div>
    {contacts.map((contact) => (
      <Contact contact={contact} key={contact.id}></Contact>
    ))}
  </div>
);

export default ContactList;
