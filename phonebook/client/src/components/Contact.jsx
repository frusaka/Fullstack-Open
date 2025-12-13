import personsService from "../services/persons";

const Contact = ({ contact, setContacts, notify }) => {
  const remove = () => {
    if (!window.confirm(`Are you sure you want to delete ${contact.name}?`))
      return;
    personsService
      .remove(contact.id)
      .then(() =>
        personsService.getAll().then((persons) => setContacts(persons))
      )
      .then(() => notify({ message: `Deleted ${contact.name}`, success: true }))
      .catch(() =>
        notify({ message: `${contact.name} was not found`, sucess: false })
      );
  };
  return (
    <div>
      {contact.name} {contact.number}
      <button onClick={remove}>delete</button>
    </div>
  );
};

export default Contact;
