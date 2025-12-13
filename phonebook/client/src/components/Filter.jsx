const Filter = ({ value, setter }) => (
  <div>
    Search:
    <input value={value} onChange={(e) => setter(e.target.value)} />
  </div>
);

export default Filter;
