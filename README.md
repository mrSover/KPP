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
WeatherService.getWeatherByCity(cityName)
```

example:

```
const cityWeather = await WeatherService.getWeatherByCity('Kyiv');
```

getWeatherByCoordinates(lat, lon)
example: const coordinatesWeather = await WeatherService.getWeatherByCoordinates(50.4501, 30.5234);

Функції асинхронні, тому не забувайте await
