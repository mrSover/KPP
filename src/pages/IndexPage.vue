<template>

  <div :class="['weather-page', isDay ? 'day' : 'night']">
    <!-- Поиск города -->
    <div class="search-container">
      <q-input
        v-model="city"
        label="Enter city"
        filled
        @keydown.enter="fetchWeatherByCity"
        input-style="color: rgba(234, 224, 243); font-size: 22px; text-align: center;"
      />

    </div>
    <q-btn label="Get Weather"
    style="color: rgba(244, 238, 244);  background-color: #162944; padding: 14px; border-radius: 25px; border-top-left-radius: 0px; margin-bottom: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);"
    @click="fetchWeatherByCity" />
    <!-- Информация о погоде -->
    <div v-if="weatherData" class="weather-info">
      <div class="header-container">
        <h2>{{ displayCity }}</h2>
        <img :src="getWeatherIcon(weatherData.weather[0].icon)" alt="Weather Icon" class="weather-icon" />
      </div>
      <div class="current-weather">
        <div class="weather-box">
          <p>Temperature: {{ weatherData.main.temp }} °C</p>
          <p>Weather: {{ weatherData.weather[0].description }}</p>
          <p>Humidity: {{ weatherData.main.humidity }}%</p>
        </div>
      </div>

      <!-- Прогноз на 10 часов -->
      <div class="hourly-forecast">
        <h3>Hourly Forecast</h3>
        <div class="forecast-grid">
          <div v-for="hour in hourlyForecast" :key="hour.time_epoch" class="hour-box">
            <p>{{ formatTime(hour.time_epoch) }}: {{ hour.temp_c }} °C</p>
          </div>
        </div>
      </div>

      <!-- Прогноз на 7 дней -->
      <div class="daily-forecast">
        <h3>7-Day Forecast</h3>
        <div class="forecast-grid">
          <div v-for="day in dailyForecast" :key="day.date_epoch" class="day-box">
            <p>{{ formatDate(day.date_epoch) }}: {{ day.day.avgtemp_c }} °C</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="city && !weatherData" style="margin-top: 15px;">
      <p>No weather data available for {{ displayCity }}. Try again.</p>
    </div>
  </div>
  <footer>
        <p>&copy; 2024 All rights reserved</p>
    </footer>
</template>

<script>

import { WeatherService } from "../../service/WeatherService";

export default {
  data() {
    return {
      city: 'Dnipro', // Город по умолчанию
      displayCity: 'Dnipro',
      weatherData: null, // Данные о погоде
      hourlyForecast: [], // Прогноз на следующие 10 часов
      dailyForecast: [], // Прогноз на 7 дней
      isDay: true, // Проверка дня или ночи
    };
  },
  methods: {
    // Получение погоды по названию города
    getWeatherIcon(iconCode) {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    },
    async fetchWeatherByCity() {
      if (!this.city) {
        console.error('City name is required.');
        return;
      }

      try {
        this.displayCity = this.city;
        // Получаем данные о погоде (текущая погода от OpenWeather)
        this.weatherData = await WeatherService.getWeatherByCity(this.city);

        // Прогноз на 10 часов (от WeatherAPI)
        this.hourlyForecast = await WeatherService.getForecastDayHour(this.city, 1);

        // Прогноз на 7 дней (от WeatherAPI)
        this.dailyForecast = await WeatherService.getForecastDay(this.city, 7);

        // Определяем день или ночь
        const currentHour = new Date().getHours();
        this.isDay = currentHour >= 6 && currentHour < 18;
      } catch (error) {
        console.error('Error fetching weather data:', error);
        this.weatherData = null; // Сбрасываем данные при ошибке
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.getHours() + ':00';
    },
    formatDate(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.toDateString();
    },
  },
  mounted() {
    // Загружаем погоду для города по умолчанию при загрузке компонента
    this.fetchWeatherByCity();
  },
};
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center; /* Вертикальное выравнивание по центру */
  justify-content: center;
  padding-left: 20px;
}
.weather-icon {
  width: 50px; /* размер иконки */
  height: 50px;
  margin-right: 5px; /* пространство между иконкой и текстом */
}
.weather-page {
  max-width: 100%;
  height: 100vh;
  padding: 20px;
  text-align: center;

}

.day {
  background: linear-gradient(to right, #0d1c33, #062227);

}

.night {
  background: linear-gradient(to right, #000000, #172429);
}

.weather-box {
  font-size: 18px;
  background: rgba(25, 27, 43, 0.1);
  border: 2px solid rgb(228, 228, 228,0.3);
  border-radius: 10px;
  padding: 10px;
  padding-top: 20px;
  margin: 20px auto;
  max-width: 350px;
}

.search-container {

  background: rgba(209, 193, 248, 0.25);
  border-radius: 10px;
  margin: 20px auto;
  padding-bottom: 5px;
  max-width: 400px;
}

.hourly-forecast,
.daily-forecast {
  margin-top: 40px;

}

.forecast-grid {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.hour-box,
.day-box {
  background: rgba(168, 207, 116, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 10px;
  padding-top: 15px;
  width: 120px;

}
h2, h3 {
  margin: 20px 0;
  color: rgb(234, 224, 243);
}
h3 {
  color: rgba(234, 224, 243, 0.75);
}


p {
  color: rgb(224, 232, 243);
}
footer {

  background: rgba(0, 0, 0, 0.2);
  text-align: center;
  padding-top: 20px;
  color: rgb(234, 224, 243);
  bottom: 0;
  width: 100%;
  }
</style>
