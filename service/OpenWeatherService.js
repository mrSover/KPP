const axios = require('axios');

const API_KEY = '3515522ce40225e94ec9b09d78ade6a4';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const WeatherService = {
  async getWeatherByCity(cityName) {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: cityName,
          appid: API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data by city:', error);
      throw error;
    }
  },

  async getWeatherByCoordinates(lat, lon) {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          lat: lat,
          lon: lon,
          appid: API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw error;
    } 
  }
};

module.exports = WeatherService;


// Тестування сервісу
// (async () => {
//   try {
//     const cityWeather = await WeatherService.getWeatherByCity('Kyiv');
//     console.log('Weather in Kyiv:', cityWeather);

//     const coordinatesWeather = await WeatherService.getWeatherByCoordinates(50.4501, 30.5234);
//     console.log('Weather for coordinates [50.4501, 30.5234]:', coordinatesWeather);
//   } catch (error) {
//     console.error('An error occurred during service testing:', error);
//   }
// })();