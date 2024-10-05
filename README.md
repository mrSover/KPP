# Quasar App (testq)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## Testing service

node service/OpenWeatherService.js + розкоментуйте тестову частину сервіса

## methods

```
const WeatherService = require('/path/OpenWeatherService.js')
```

ПОГОДА ПО МІСТУ

```
WeatherService.getWeatherByCity(cityName)
```

example:

```
const cityWeather = await WeatherService.getWeatherByCity('Kyiv');
```

ПОГОДА ЗА КООРДИНАТАМИ

```
getWeatherByCoordinates(lat, lon)
```

example:

```
const coordinatesWeather = await WeatherService.getWeatherByCoordinates(50.4501, 30.5234);
```

ПРОГНОЗ НА 3 ДНІ

```
getForecastDay(cityName, days)
```

example:

```
const dailyForecast = await WeatherService.getForecastDay('Kyiv', 3);
```

ПОГОДИННИЙ ПРОГНОЗ

```
getForecastDayHour(cityName, day)
// day - це день відносно сьогоднішнього, на який треба прогноз.
// day = 1 - це сьогодні, 2 - завтра і т.д.
```

example:

```
const hourlyForecast = await WeatherService.getForecastDayHour('Kyiv', 1);
```

Функції асинхронні, тому не забувайте await
