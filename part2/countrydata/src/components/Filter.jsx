export default function Filter({ value, setter }) {
  return (
    <div>
      Search:
      <input value={value} onChange={(e) => setter(e.target.value)} />
    </div>
  );
}
