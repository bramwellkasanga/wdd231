const weatherStatus = document.querySelector("#weather-status");
const weatherContent = document.querySelector("#weather-content");
const currentTemperature = document.querySelector("#current-temperature");
const currentDescription = document.querySelector("#current-description");
const weatherForecast = document.querySelector("#weather-forecast");

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

function formatForecastDate(date) {
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

function renderWeather(data) {
  const { current, daily } = data;
  if (
    !Number.isFinite(current?.temperature_2m) ||
    !Number.isFinite(current?.weather_code) ||
    !Array.isArray(daily?.time) ||
    !Array.isArray(daily?.temperature_2m_max) ||
    !Array.isArray(daily?.temperature_2m_min) ||
    daily.time.length < 4 ||
    daily.temperature_2m_max.length < 4 ||
    daily.temperature_2m_min.length < 4
  ) {
    throw new Error("The weather service returned incomplete data.");
  }

  currentTemperature.textContent = `${Math.round(current.temperature_2m)}°C`;
  currentDescription.textContent =
    weatherDescriptions[current.weather_code] ?? "Conditions unavailable";

  weatherForecast.replaceChildren(
    ...daily.time.slice(1, 4).map((date, index) => {
      const forecastIndex = index + 1;
      const high = daily.temperature_2m_max[forecastIndex];
      const low = daily.temperature_2m_min[forecastIndex];
      if (!Number.isFinite(high) || !Number.isFinite(low)) {
        throw new Error("The weather service returned invalid forecast temperatures.");
      }

      const item = document.createElement("li");
      item.className = "forecast-day";

      const dateLabel = document.createElement("span");
      dateLabel.textContent = formatForecastDate(date);

      const highLabel = document.createElement("strong");
      highLabel.textContent = `High ${Math.round(high)}°C`;

      const lowLabel = document.createElement("span");
      lowLabel.textContent = `Low ${Math.round(low)}°C`;

      item.append(dateLabel, highLabel, lowLabel);
      return item;
    }),
  );
  weatherContent.hidden = false;
  weatherStatus.hidden = true;
}

async function getWeather() {
  const parameters = new URLSearchParams({
    latitude: "-26.225",
    longitude: "28.17",
    current: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "Africa/Johannesburg",
    forecast_days: "4",
    temperature_unit: "celsius",
  });

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${parameters}`,
    );
    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}`);
    }

    renderWeather(await response.json());
  } catch (error) {
    console.error("Unable to load Germiston weather:", error);
    weatherStatus.textContent =
      "Local weather is currently unavailable. Please try again later.";
  }
}

getWeather();
