export default function SearchMatch({ country, setter }) {
  const style = {
    display: "block",
  };
  return (
    <button onClick={() => setter(country)} style={style}>
      {country.name.common}
    </button>
  );
}
