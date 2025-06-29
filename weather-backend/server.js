// server.js

// Import necessary modules
const express = require('express'); // Express.js for creating the server
const cors = require('cors'); // CORS middleware to allow cross-origin requests
const fetch = require('node-fetch'); // node-fetch for making HTTP requests (install with npm install node-fetch@2)
const YAML = require('yaml');
// Imports the Parametermanager library
const {ParameterManagerClient} = require('@google-cloud/parametermanager').v1;

const app = express(); // Initialize Express app
const PORT = process.env.PORT || 5001; // Define the port for the server
const startupConfigProject = "annular-text-460910-i0"
const startupConfigLocation = "global"
const startupConfigParameter = "my-weather-demo-parameter"
const startupConfig = `projects/${startupConfigProject}/locations/${startupConfigLocation}/parameters/${startupConfigParameter}/versions/`
const appVersion = "v1"
// Instantiates a client
const parametermanagerClient = new ParameterManagerClient();
let CONFIG = undefined

// Middleware
app.use(cors()); // Enable CORS for all routes, allowing frontend to connect
app.use(express.json()); // Enable parsing of JSON request bodies

// You can get one from: https://openweathermap.org/api & store it in Secret Manager
// & use Parameter Manager to fetch it along with other relevant configuration parameters.
let OPENWEATHER_API_KEY = ''; // set on server startup by fetching it from Parameter Manager
// Base URL for OpenWeatherMap API
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function callRenderParameterVersion(name) {
  // Construct request
  const request = {
    name,
  };

  // Run request
  const [response] = await parametermanagerClient.renderParameterVersion(request);
  try {
    CONFIG = YAML.parse(response.renderedPayload.toString('utf8'));
    console.log(CONFIG);
  } catch (e) {
    console.error('Error parsing YAML parameters to utf8:', e);
  }
}

/**
 * @route GET /api/weather
 * @desc Fetches weather data for a given city
 * @param {object} req - Express request object. Expects 'city' as a query parameter.
 * @param {object} res - Express response object. Sends weather data or error.
 */
app.get('/api/weather', async (req, res) => {
  const city = req.query.city; // Get city from query parameters (e.g., /api/weather?city=London)

  if (!city) {
    // If no city is provided, send a 400 Bad Request error
    return res.status(400).json({ message: 'City parameter is required.' });
  }

  try {
    // Construct the OpenWeatherMap API URL
    let unit = "metric"
    let temperatureSuffix = "°C"
    if (CONFIG.fahrenheit) {
      unit = "imperial"
      temperatureSuffix = "°F"
    }
    const apiUrl = `${OPENWEATHER_BASE_URL}?q=${city}&appid=${OPENWEATHER_API_KEY}&units=${unit}`; // units=metric for Celsius
    console.log(apiUrl)

    // Make the API call to OpenWeatherMap
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if the API call was successful
    if (response.ok) {
      // Process the data to send a simplified, relevant response to the frontend
      const weatherData = {
        city: data.name,
        country: data.sys.country,
        temperature: `${Math.round(data.main.temp)}${temperatureSuffix}`, // Round temperature
        description: data.weather[0].description,
        humidity: `${data.main.humidity}%`,
        showHumidity: CONFIG.showHumidity,
        windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`, // Convert m/s to km/h
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, // OpenWeatherMap icon URL
        offline: false
      };
      res.json(weatherData); // Send processed data to frontend
    } else {
      // If OpenWeatherMap returns an error (e.g., city not found or API is down)
      console.error('OpenWeatherMap API Error:', data);

      // return dummy data based on defaultLocation
      const dummyData = CONFIG.dummyData.find((d) => d.city === CONFIG.defaultLocation)

      const weatherData = {
        city: dummyData.city,
        temperature: `${dummyData.temperature}`,
        description: dummyData.description,
        humidity: `${dummyData.humidity}`,
        showHumidity: CONFIG.showHumidity,
        windSpeed: `${dummyData.windSpeed}`,
        icon: `${dummyData.icon}`, // OpenWeatherMap icon URL
        offline: true
      };

      res.json(weatherData); // Send processed dummy data to frontend
    }
  } catch (error) {
    // Catch any network or server-side errors
    console.error('Server error fetching weather:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start the server
(async () => {
  try {
    // Fetch the application parameters & set them in CONFIG variable
    await callRenderParameterVersion(startupConfig + appVersion)

    app.listen(PORT, () => {
      OPENWEATHER_API_KEY = CONFIG.apiKey
      console.log(`Node.js Weather Backend listening on port ${PORT}`);
      console.log(`Visit http://localhost:${PORT}/api/weather?city=London in your browser to test.`);
    });
  } catch (error) {
    console.error('Error during pre-server setup:', error);
    process.exit(1); // Exit if critical setup fails
  }
})();
