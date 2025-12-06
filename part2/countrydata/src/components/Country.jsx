import axios from "axios";
import { useEffect, useState } from "react";

import WeatherInfo from "./WeatherInfo";

const API_KEY = import.meta.env.VITE_WEATHER;

export default function Country({ country }) {
  const [weather, setWeather] = useState(null);
  const [lat, lon] = country.capitalInfo.latlng;
  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      )
      .then((resp) =>
        setWeather({
          main: resp.data.weather[0].main,
          icon: resp.data.weather[0].icon,
          feels: resp.data.main.feels_like,
          temp: resp.data.main.temp,
          humidity: resp.data.main.humidity,
        })
      );
  }, []);
  return (
    <div>
      <div>
        <h1>{country.name.common}</h1>
        Capital {country.capital} <br />
        Area {country.area}
      </div>
      <h2>Lanuages</h2>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <h2>{country.capital} Weather</h2>
      <WeatherInfo data={weather} />
    </div>
  );
}
