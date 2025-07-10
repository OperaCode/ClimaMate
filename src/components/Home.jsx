import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { Sun, Moon, CloudRain, Cloud, Wind } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;



// generate suggestion based on weather
const getSuggestion = (temp, desc) => {
  if (!temp || !desc) return "";
  if (desc.includes("rain")) return "Carry an umbrella today 🌧️";
  if (temp > 30) return "Stay hydrated, it's quite hot ☀️";
  if (temp < 15) return "Wear a warm jacket, it's chilly 🧥";
  return "Weather looks great for your day! 😊";
};

// greetings on weather
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Home = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [forecast, setForecast] = useState(null);

  const weatherFacts = [
    "Raindrops can fall at speeds of about 22 mph.",
    "Lightning is five times hotter than the sun’s surface.",
    "The coldest temperature recorded was -89.2°C in Antarctica.",
    "Snowflakes can take up to an hour to reach the ground.",
  ];

 
// To fetch current weather for user
  useEffect(() => {
    const fetchCurrentWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Lagos&appid=${apiKey}&units=metric`
        );
        setCurrentWeather(res.data);

        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast`,
          {
            params: { q: res.data.name, appid: apiKey, units: "metric" },
          }
        );
        setForecast(forecastRes.data);
      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    };
    fetchCurrentWeather();
  }, [apiKey]);


  // Helper function- weather facts
  useEffect(() => {
    const interval = setInterval(() => {
      setTriviaIndex((prev) => (prev + 1) % weatherFacts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);


  // fetch weather from search
  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) {
      toast.error("Please enter a city");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: { q: city, appid: apiKey, units: "metric" },
        }
      );
      setWeather(res.data);
      toast.success(`Weather fetched for ${res.data.name}`);
    } catch (error) {
      console.error("Error fetching weather:", error);
      if (error.response?.status === 404) toast.error("City not found");
      else toast.error("Error fetching weather");
    } finally {
      setLoading(false);
    }
  };


  // UI/UX weather Icon
  const getWeatherIcon = (main) => {
    if (!main) return <Wind size={48} className="text-gray-400" />;
    const w = main.toLowerCase();
    if (w.includes("clear")) return <Sun size={48} className="text-yellow-400" />;
    if (w.includes("rain") || w.includes("drizzle"))
      return <CloudRain size={48} className="text-blue-400" />;
    if (w.includes("cloud")) return <Cloud size={48} className="text-gray-400" />;
    return <Wind size={48} className="text-gray-400" />;
  };

  // Weather Recommendations
  const getEventSuggestion = (temp, desc) => {
    if (!temp || !desc) return "No suggestion";
    if (desc.includes("rain")) return "Consider indoor activities today.";
    if (temp > 30) return "Great for outdoor sports or errands.";
    if (temp < 15) return "Stay warm, maybe visit a cafe or read indoors.";
    return "Perfect day for any plans you have!";
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400 text-gray-900"
      } min-h-screen flex flex-col relative`}
    >
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-cyan-400/80 backdrop-blur-md shadow-sm">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sun size={24} className="text-yellow-300 animate-spin-slow" /> ClimaMate
        </h1>
        <div className="flex gap-4">
          <button className="cursor-pointer" onClick={() => setDarkMode(!darkMode)} >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <Link to="/">
            <button className="font-medium px-4 py-2 cursor-pointer rounded-lg hover:bg-white/20 transition duration-300" >
              Exit
            </button>
          </Link>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 py-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl font-extrabold mb-2"
        >
          Check your weather instantly
        </motion.h2>
        <p className="text-lg mb-6">{getGreeting()}, Welcome to ClimaMate 👋</p>

        <section className="flex flex-col lg:flex-row w-full gap-6 justify-center items-start">
          {/* Current Weather Card */}
          {currentWeather && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-xl  shadow-xl p-6 w-full lg:w-2/3 flex-1"
            >
              <h3 className="text-xl font-bold mb-4">
                Current Weather ({currentWeather.name})
              </h3>
              <div className="flex justify-center mb-4">
                {getWeatherIcon(currentWeather.weather[0].main)}
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                {currentWeather.name}, {currentWeather.sys.country}
              </h3>
              <p className="text-5xl font-bold text-blue-600 mb-2">
                {Math.round(currentWeather.main.temp)}°C
              </p>
              <p className="text-lg capitalize mb-4">
                {currentWeather.weather[0].description}
              </p>
              <p className="text-sm mb-2">
                💡 {getSuggestion(currentWeather.main.temp, currentWeather.weather[0].description)}
              </p>
              <div className="flex justify-around text-sm mb-4">
                <p>Humidity: {currentWeather.main.humidity}%</p>
                <p>Wind: {currentWeather.wind.speed} m/s</p>
              </div>

              {/* Forecast */}
              {forecast && (
                <div className="mt-6 ">
                  <h3 className="text-lg font-bold mb-2">
                    Upcoming Forecast & Event Suggestions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                    {forecast.list.slice(0, 8).map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 * i }}
                        className="bg-gradient-to-br from-white/70 to-white/50 rounded-lg p-4 shadow hover:scale-105 transition-transform"
                      >
                        <p className="text-sm text-gray-600">
                          {new Date(item.dt_txt).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 my-2">
                          {getWeatherIcon(item.weather[0].main)}
                          <p
                            className={`text-lg font-semibold ${
                              item.main.temp > 30
                                ? "text-red-500"
                                : item.main.temp < 15
                                ? "text-blue-500"
                                : "text-green-600"
                            }`}
                          >
                            {Math.round(item.main.temp)}°C
                          </p>
                        </div>
                        <p className="capitalize text-gray-700">{item.weather[0].description}</p>
                        <p className="text-xs mt-2">
                          💡 {getEventSuggestion(item.main.temp, item.weather[0].description)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          <div className="flex-1">
            {/* Search Form */}
            <form onSubmit={fetchWeather} className="flex flex-col sm:flex-row gap-4 w-full">
              <input
                type="text"
                placeholder="Enter city name e.g. Lagos"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg  border-2 border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                aria-label="City name input"
              />
              <button
                type="submit"
                disabled={loading}
                className=" cursor-pointer bg-yellow-400 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition flex items-center justify-center gap-2"
                
              >
                {loading && <ClipLoader size={20} color="#333" />}
                <span>{loading ? "Searching..." : "Search"}</span>
              </button>
            </form>

            {/* Searched Weather Card */}
            {weather && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-zinc-100 backdrop-blur-md rounded-xl shadow-xl p-6 w-full mt-4"
              >
                <h3 className="text-xl font-bold mb-4">Searched Weather</h3>
                <div className="flex justify-center mb-4">
                  {getWeatherIcon(weather.weather[0].main)}
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {weather.name}, {weather.sys.country}
                </h3>
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  {Math.round(weather.main.temp)}°C
                </p>
                <p className="text-lg capitalize mb-4">{weather.weather[0].description}</p>
                <p className="text-sm mb-2">
                  💡 {getSuggestion(weather.main.temp, weather.weather[0].description)}
                </p>
                <div className="flex justify-around text-sm">
                  <p>Humidity: {weather.main.humidity}%</p>
                  <p>Wind: {weather.wind.speed} m/s</p>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>


      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center bg-white/10 backdrop-blur-md mt-auto z-10">
        <p className="text-sm">© 2025 ClimaMate. All rights reserved.</p>
      </footer>

      {/* Trivia- Weather Facts */}
      <AnimatePresence mode="wait">
        <motion.div
          key={triviaIndex}
          initial={{ opacity: 0, x: 50, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 50, y: -20 }}
          transition={{ duration: 0.8 }}
          className="fixed top-24 right-4 bg-white/30 backdrop-blur-lg rounded-xl px-4 py-3 shadow-lg w-64 max-w-xs sm:max-w-sm"
        >
          <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
            <Wind size={16} className="text-yellow-300" /> Weather Facts
          </h3>
          <p className="text-sm">{weatherFacts[triviaIndex]}</p>
        </motion.div>
      </AnimatePresence>

      <style jsx="true">{`
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spinSlow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
