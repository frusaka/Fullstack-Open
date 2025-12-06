import SearchMatch from "./SearchMatch";

export default function SearchResults({ data, countrySetter }) {
  if (data == null) return <p>Search by country name</p>;
  if (data.length > 10) {
    return <p>Too many matches. Try a specific filter</p>;
  }
  return (
    <div>
      {data.map((country, idx) => (
        <SearchMatch country={country} key={idx} setter={countrySetter} />
      ))}
    </div>
  );
}
