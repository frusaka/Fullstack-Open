import { useState, useEffect } from "react";
import axios from "axios";

import Filter from "./components/Filter";
import SearchResults from "./components/SearchResults";
import Country from "./components/Country";

export default function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [queries, setQueries] = useState(null);
  const [country, setCountry] = useState(null);

  const updateQuery = (value) => {
    const validCountries = value
      ? countries.filter((country) =>
          Object.values(country.name).some((name) =>
            typeof name == "string"
              ? name.toLowerCase().includes(value.toLowerCase())
              : false
          )
        )
      : null;
    setQueries(validCountries);
    setSearch(value);
    if (validCountries && validCountries.length == 1)
      countrySetter(validCountries[0]);
  };

  const countrySetter = (value) => {
    setQueries(null);
    setCountry(value);
  };
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => setCountries(response.data));
  }, []);
  return (
    <div>
      <Filter value={search} setter={updateQuery} />
      <SearchResults data={queries} countrySetter={countrySetter} />
      {country ? <Country country={country} /> : null}
    </div>
  );
}
