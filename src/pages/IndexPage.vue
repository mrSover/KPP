<template>
  <div>
    <h1>Weather Information</h1>
    <p v-if="weather">City: {{ weather.name }}</p>
    <p v-if="weather">Temperature: {{ weather.main.temp }}°C</p>
    <p v-if="weather">Weather: {{ weather.weather[0].description }}</p>
    <p v-if="error">{{ error }}</p>
    <button @click="fetchWeather">Get Weather</button>
  </div>
</template>

<script>
import { WeatherService } from "../weatherService";

export default {
  data() {
    return {
      weather: null,
      error: null,
    };
  },
  methods: {
    async fetchWeather() {
      try {
        this.error = null;
        const city = "Kyiv"; // Змініть на бажане місто
        this.weather = await WeatherService.getWeatherByCity(city);
      } catch (err) {
        this.error = "Failed to fetch weather data";
      }
    },
  },
};
</script>
