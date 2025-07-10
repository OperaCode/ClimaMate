import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { Sun, CloudRain, Cloud, Wind, Loader2 } from "lucide-react";

const getSuggestion = (temp, desc) => {
  if (!temp || !desc) return "";
  if (desc.includes("rain")) return "Carry an umbrella today 🌧️";
  if (temp > 30) return "Stay hydrated, it's quite hot ☀️";
  if (temp < 15) return "Wear a warm jacket, it's chilly 🧥";
  return "Weather looks great for your day! 😊";
};

const Home = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const weatherFacts = [
    "Raindrops can fall at speeds of about 22 mph.",
    "Lightning is five times hotter than the sun’s surface.",
    "The coldest temperature recorded was -89.2°C in Antarctica.",
    "Snowflakes can take up to an hour to reach the ground.",
  ];

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city) {
      toast.error("Please enter a city");
      return;
    }

    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: apiKey,
            units: "metric",
          },
        }
      );
      setWeather(res.data);
      toast.success(`Weather fetched for ${res.data.name}`);
    } catch (error) {
      console.error("Error fetching weather:", error);
      if (error.response?.status === 404) toast.error("City not found");
      else if (error.response?.status === 401) toast.error("Invalid API key");
      else toast.error("Error fetching weather");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (main) => {
    if (!main) return <Wind size={48} className="text-gray-400" />;
    const w = main.toLowerCase();
    if (w.includes("clear")) return <Sun size={48} className="text-yellow-400" />;
    if (w.includes("rain") || w.includes("drizzle"))
      return <CloudRain size={48} className="text-blue-400" />;
    if (w.includes("cloud")) return <Cloud size={48} className="text-gray-400" />;
    return <Wind size={48} className="text-gray-400" />;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400 px-4 py-8">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white/10 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sun size={24} className="text-yellow-300 animate-spin-slow" /> ClimaMate
        </h1>
        <nav className="flex gap-4">
          <Link to="/">
            <button
              className="text-white font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition duration-300"
              aria-label="Back to Landing Page"
            >
              Home
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="w-full max-w-lg text-center mt-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 drop-shadow-lg">
          Check your weather instantly
        </h2>

        {/* Form */}
        <form onSubmit={fetchWeather} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-white/80 backdrop-blur-md border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            aria-label="City name input"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition flex items-center justify-center"
            aria-label="Search weather"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : "Search"}
          </button>
        </form>

        {/* Weather Card */}
        {weather && (
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 mb-6 animate-fadeIn">
            <div className="flex justify-center mb-4">
              {getWeatherIcon(weather.weather[0].main)}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {weather.name}, {weather.sys.country}
            </h3>
            <p className="text-5xl font-bold text-blue-600 mb-2">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="text-lg capitalize text-gray-600 mb-4">
              {weather.weather[0].description}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              💡 {getSuggestion(weather.main.temp, weather.weather[0].description)}
            </p>
            <div className="flex justify-around text-sm text-gray-500">
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}

        {/* Trivia */}
        <div className="bg-white/30 backdrop-blur-lg rounded-xl px-6 py-4 max-w-md mx-auto shadow-lg animate-slideIn mt-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-white">
            <Wind size={20} className="text-yellow-300" /> Weather Trivia
          </h3>
          <p className="text-sm text-white/80">
            {weatherFacts[Math.floor(Math.random() * weatherFacts.length)]}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center bg-white/10 backdrop-blur-md mt-auto z-10">
        <p className="text-sm text-white">© 2025 ClimaMate. All rights reserved.</p>
      </footer>

      {/* Animations */}
      <style jsx="true">{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spinSlow 10s linear infinite; }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn { animation: slideIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Home;
