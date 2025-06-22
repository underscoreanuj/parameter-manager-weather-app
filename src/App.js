import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // State for the city input by the user
  const [city, setCity] = useState('');
  // State for the weather data fetched
  const [weatherData, setWeatherData] = useState(null);
  // State for loading indicator
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState('');

  // Function to simulate fetching weather data
  const fetchWeather = async (searchCity) => {
    setLoading(true); // Set loading to true when fetching starts
    setError(''); // Clear any previous errors
    setWeatherData(null); // Clear previous weather data

    try {
      // Make Axios GET request to your Node.js backend server
      const response = await axios.get(`http://localhost:5001/api/weather`, {
        params: {
          city: searchCity
        }
      });

      // Assuming your backend sends back data in a format like:
      // { city: 'London', temperature: '15°C', description: 'Partly Cloudy', humidity: '70%', windSpeed: '10 km/h', icon: '...' }
      setWeatherData(response.data);
      console.log(response.data)
    } catch (err) {
      console.error('Error fetching weather from backend:', err);
      // Handle different error responses from the backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError('Failed to fetch weather data. Please ensure the backend server is running and try again.');
      }
    } finally {
      setLoading(false); // Set loading to false once fetching is complete
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (city.trim()) { // Only fetch if city input is not empty
      fetchWeather(city.trim());
    } else {
      setError('Please enter a city name.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4 font-sans">
      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Weather App
          {(weatherData && weatherData.offline) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
              <strong className="font-bold">Weather API is offline! showing dummy data from a default location.</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
        </h1>

        {/* City Search Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g., London)"
            className="flex-grow p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Searching...' : 'Get Weather'}
          </button>
        </form>

        {/* Loading and Error Messages */}
        {loading && (
          <div className="flex items-center justify-center text-blue-700 font-semibold text-lg py-4">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading weather data...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {/* Weather Display */}
        {weatherData && !loading && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">{weatherData.city}</h2>
              <span className="text-5xl"><img
                src={weatherData.icon}
                alt="new"
              /></span>
            </div>
            <p className="text-6xl font-extrabold mb-4">{weatherData.temperature}</p>
            <p className="text-2xl mb-2">{weatherData.description}</p>
            <div className="grid grid-cols-2 gap-4 text-lg">
              <p>Humidity: <span className="font-semibold">{weatherData.humidity}</span></p>
              <p>Wind Speed: <span className="font-semibold">{weatherData.windSpeed}</span></p>
            </div>
          </div>
        )}

        {/* Initial message or no data message */}
        {!weatherData && !loading && !error && (
          <div className="text-center text-gray-600 text-lg py-8">
            Enter a city name above to get started!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
