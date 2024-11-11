<template>

  <div :class="['weather-page', isDay ? 'day' : 'night']">
    
    <div class="search-container">
      <q-input
        v-model="city"
        filled
        placeholder="Enter city"
        @keydown.enter="fetchWeatherByCity"
        input-style="color: rgba(234, 224, 243); font-size: 22px; text-align: left;"
      />
    </div>

    <div v-if="weatherData" class="weather-info">

      <div class="header-container">
        <h2>{{ displayCity }}</h2>
        <img :src="getWeatherIcon(weatherData.weather[0].icon)" alt="Weather Icon" class="weather-icon" />
        <div class="current-weather-data">
          Temperature: {{ weatherData.main.temp }} °C
          <br>Humidity: {{ weatherData.main.humidity }}%
          <br>Wind: {{ weatherData.wind.speed }} m/s
        </div>
        <div class="weather-desc">
          Weather
          <br>{{ getCurrentDayName() }}
          <br>{{ capitalizeFirstLetter(weatherData.weather[0].description) }}
        </div>
      </div>

      <div class="tabs">
        <q-btn
          :class="{ active: activeTab === 'temperature' }"
          @click="fillChart('temperature')"
          label="Temperature"
          flat
          unelevated
        />
        <q-btn
          :class="{ active: activeTab === 'humidity' }"
          @click="fillChart('humidity')"
          label="Humidity"
          flat
          unelevated
        />
      </div>

      <div class="chart-container">
        <apexchart 
          width="960px"
          height="350px"
          type="line" 
          :options="chartOptions" 
          :series="chartSeries">
        </apexchart>
      </div>

      <div class="daily-forecast">
        <h3>7-Day Forecast</h3>
        <div>
          <q-btn
            v-for="day in dailyForecast"
            :key="day.date_epoch"
            class="day-box"
            @click="onDayClick(day)"
            :label="null"
            flat
            unelevated
            :style="{ color: 'rgb(224, 232, 243)' }"
            v-html="getButtonLabel(day)"
            :class="{ selected: selectedDay === day }"
          />
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-else-if="city && !weatherData" style="margin-top: 15px;">
      <p>No weather data available for {{ displayCity }}. Try again.</p>
    </div>
  </div>
</template>

<script>

import { WeatherService } from "../../service/WeatherService";
import VueApexCharts from "vue3-apexcharts";

export default {
  data() {
    return {
      city: 'Dnipro', // Default city
      displayCity: 'Dnipro',
      weatherData: null, // Info about current weather
      dailyForecast: [], // Forecast for 7 days
      isDay: true, // Day or night check
      chartOptions: [],
      chartSeries: [],
      activeTab: 'temperature', // Default active tab
      selectedDay: null,
      twoHourIntervals: [],
    };
  },
  components: {
    apexchart: VueApexCharts
  },
  methods: {
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
        this.city = '';
        this.weatherData = await WeatherService.getWeatherByCity(this.displayCity);
        this.dailyForecast = await WeatherService.getForecastDay(this.displayCity, 7);

        const currentHour = new Date().getHours();
        this.isDay = currentHour >= 6 && currentHour < 18;
        console.log(this.weatherData)
        this.selectedDay = this.dailyForecast[0];
        this.fillChart('temperature');
        
      } catch (error) {
        console.error('Error fetching weather data:', error);
        this.weatherData = null;
      }

    },

    formatTime(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.getHours() + ':00';
    },

    formatDate(timestamp) {
      const date = new Date(timestamp * 1000);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };  // Customize formatting options
      return date.toLocaleDateString(undefined, options);  // Return formatted date (e.g., "Oct 13")
    },

    getCurrentDayName() {
      const date = new Date();
      const options = { weekday: 'long' }; // Use 'short' for abbreviated day names (e.g., Mon, Tue)
      return date.toLocaleDateString(undefined, options);
    },

    getButtonLabel(day) {
      return `
        ${this.formatDate(day.date_epoch)}
        <img src="http:${day.day.condition.icon}" alt="Weather Icon" class="weather-icon" />
        ${day.day.maxtemp_c}° ${day.day.mintemp_c}°
        `;
    },

    capitalizeFirstLetter(string) {
      if (!string) return string;
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    onDayClick(day) {
      this.selectedDay = day;
      this.fillChart(this.activeTab);
    },

    fillChart(activeTabName) {
      if (activeTabName === 'temperature') {
        this.fillTemperatureChart(this.selectedDay);
      } else if (activeTabName === 'humidity') {
        this.fillHumidityChart(this.selectedDay);
      }

      this.activeTab = activeTabName;
    },

    fillChartOptions(xAxisData) {
      this.chartOptions = {
        chart: {
          type: 'line',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        
        yaxis: {
          labels: {
            show: false
          }
        },
        xaxis: {
          categories: xAxisData.map(item => this.formatTime(item.time_epoch)),
          labels: {
            style: {
              colors: 'white',
            }
          },
          crosshairs: {
            show: false
          },
          tooltip: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: true
        },
        grid: {
          show: false
        },
        dataLabels: {
          enabled: true,
          offsetY: -7,
          background: {
            enabled: false
          },
          style: {
            colors: ['#e0e8f3']
          }
        }
      };
    },

    fillTemperatureChart(day) {
      const twoHourIntervals = day.hour.filter((item, index) => index % 2 === 0);

      this.chartSeries = [{ name: 'Temperature', data: [] }];

      for (let i = 0; i < day.hour.length; ++i) {
        if (i % 2 === 0) {
          this.chartSeries[0].data.push(day.hour[i].temp_c);
        }
      }

      this.fillChartOptions(twoHourIntervals);

      this.chartOptions.stroke = {
        curve: 'smooth',
        width: 2,
        colors: ['#f8e255']
      };
    },

    fillHumidityChart(day) {
      const twoHourIntervals = day.hour.filter((item, index) => index % 2 === 0);

      this.chartSeries = [{ name: 'Humidity', data: [] }];

      for (let i = 0; i < day.hour.length; ++i) {
        if (i % 2 === 0) {
          this.chartSeries[0].data.push(day.hour[i].humidity);
        }
      }

      this.fillChartOptions(twoHourIntervals);

      this.chartOptions.stroke = {
        curve: 'smooth',
        width: 2,
        colors: ['#3ca1e2']
      }
    }
  },

  mounted() {
    this.fetchWeatherByCity();
  },
};
</script>

<style scoped>
.header-container {
  width: 960px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto;
}
.weather-icon {
  width: 100px;
  height: 100px;
  margin-right: 5px;
}
.weather-page {
  max-width: 100%;
  padding: 20px;
  text-align: center;
  min-height: 100vh;
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.day {
  background: linear-gradient(to right, #0d1c33, #062227);

}

.night {
  background: linear-gradient(to right, #000000, #172429);
}

.search-container {
  border-radius: 10px;
  margin: 30px auto;
  width: 960px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.current-weather-data {
  font-size: 16px;
  color: rgb(224, 232, 243);
  text-align: left;
}

.weather-desc {
  text-align: right;
  margin-left: auto;
  font-size: 16px;
  color: rgb(224, 232, 243);
}

.hour-box,
.day-box {

  border-radius: 8px;
  padding: 10px;
  padding-top: 15px;
  width: 120px;
}
.day-box {
  background: rgba(69, 80, 55, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.25);
  margin-left: 8px;
  margin-right: 8px;
}
.day-box.selected {
  background-color: rgba(234, 234, 234, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
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
hr {
  width: 50%;
  height: 1px;
  border: none;
  background-color: rgba(196, 212, 255, 0.35);
}

.tabs {
  margin: 0 5px;
  color: rgb(224, 232, 243);
  text-decoration: none !important;
}

.active {
  text-decoration: underline !important;
  text-decoration-color: rgb(224, 232, 243);
  text-underline-offset: 6px;
}

.chart-container {
  display: flex;
  align-items: center;
  margin: 0 auto;
}

</style>
