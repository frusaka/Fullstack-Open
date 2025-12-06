export default function WeatherInfo({ data }) {
  if (!data) return null;
  return (
    <div>
      <p>
        Main: {data.main}
        <img src={`https://openweathermap.org/img/wn/${data.icon}.png`} />
      </p>
      <p>Temperature: {data.temp}</p>
      <p>Feels like: {data.feels}</p>
      <p>Humidity: {data.humidity}</p>
    </div>
  );
}
