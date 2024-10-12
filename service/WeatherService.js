import axios from 'axios';

const OPENWEATHER_API_KEY = '3515522ce40225e94ec9b09d78ade6a4'
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const WEATHERAPI_API_KEY = 'e6c7e289adaa4bb8886183549240510'
const WEATHERAPI_BASE_URL = 'http://api.weatherapi.com/v1'

class WeatherService {
  static async getWeatherByCity(cityName) {
    try {
      const response = await axios.get(`${OPENWEATHER_BASE_URL}`, {
        params: {
          q: cityName,
          appid: OPENWEATHER_API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data by city:', error);
      throw error;
    }
  }

  static async getWeatherByCoordinates(lat, lon) {
    try {
      const response = await axios.get(`${OPENWEATHER_BASE_URL}`, {
        params: {
          lat: lat,
          lon: lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw error;
    } 
  }

  static async getForecastDay(cityName, days) {
    try {
      const res = await axios.get(`${WEATHERAPI_BASE_URL}/forecast.json`, {
        params: {
          key: WEATHERAPI_API_KEY,
          q: cityName,
          days: days,
          aqi: 'no',
          alerts: 'no'
        }
      });
      return res.data.forecast.forecastday;

    } catch(error){
      console.log('Error fetching daily forecast:', error);
      throw error;
    }
  }

  static async getForecastDayHour(cityName, day = 1) {
    try {
      const forecastData = await this.getForecastDay(cityName, day);
      if (forecastData && forecastData.length > 0) {
        return forecastData[day - 1].hour;
      } else {
        throw new Error('No hourly forecast data available');
      }
    } catch (error) {
      console.error('Error fetching hourly forecast:', error);
      throw error;
    }
  }
};

export { WeatherService };

// Тестування сервісу
// (async () => {
//   try {
    // const cityWeather = await WeatherService.getWeatherByCity('Kyiv');
    // console.log('Weather in Kyiv (OpenWeather):', cityWeather);

    // const coordinatesWeather = await WeatherService.getWeatherByCoordinates(50.4501, 30.5234);
    // console.log('Weather for coordinates [50.4501, 30.5234] (OpenWeather):', coordinatesWeather);

    // const dailyForecast = await WeatherService.getForecastDay('Kyiv', 30);
    // console.log('3-day forecast for Kyiv (WeatherAPI):', dailyForecast);

//     const hourlyForecast = await WeatherService.getForecastDayHour('Kyiv', 5);
//     console.log('Hourly forecast for Kyiv (WeatherAPI):', hourlyForecast);
//   } catch (error) {
//     console.error('An error occurred during service testing:', error);
//   }
// })();