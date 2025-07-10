import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, CloudRain, Cloud, Thermometer, Wind, MapPin } from "lucide-react";
import axios from "axios";

const getSuggestion = (temp, desc) => {
  if (!temp || !desc) return "Fetching weather insights...";
  if (desc.includes("rain")) return "Carry an umbrella today. Showers expected.";
  if (temp > 30) return "Stay hydrated, it's quite hot today.";
  if (temp < 15) return "Wear a warm jacket, it's chilly.";
  return "Weather looks great for your day!";
};

const LandingPage = () => {
  const [greeting, setGreeting] = useState("");
  const [currentFact, setCurrentFact] = useState("");
  const [weather, setWeather] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const weatherFacts = [
    "The highest temperature ever recorded was 56.7°C in Death Valley, USA.",
    "The coldest temperature recorded was -89.2°C in Antarctica.",
    "Raindrops can fall at speeds of about 22 mph.",
    "Lightning is five times hotter than the sun’s surface.",
    "Snowflakes can take up to an hour to reach the ground.",
  ];

  const weatherThemes = {
    Clear: {
      icon: Sun,
      bg: "bg-gradient-to-br from-yellow-300 via-orange-200 to-blue-200",
      desc: "Bright and warm, perfect for a day out!",
    },
    Rain: {
      icon: CloudRain,
      bg: "bg-gradient-to-br from-gray-500 via-blue-600 to-teal-500",
      desc: "Cozy up with an umbrella!",
    },
    Clouds: {
      icon: Cloud,
      bg: "bg-gradient-to-br from-gray-300 via-cyan-400 to-blue-300",
      desc: "A calm day with soft skies.",
    },
    default: {
      icon: Sun,
      bg: "bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400",
      desc: "Enjoy your day with ClimaMate!",
    },
  };

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Mock location suggestions
  const mockLocations = ["Lagos, Nigeria", "London, UK", "New York, USA", "Tokyo, Japan", "Sydney, Australia"];

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Lagos&appid=${apiKey}&units=metric`
        );
        setWeather(res.data);
      } catch (err) {
        console.error("Error fetching weather:", err);
      }
    };
    fetchWeather();
  }, []);

  // Set greeting based on time and weather
  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    if (weather) {
      const temp = weather.main.temp;
      const desc = weather.weather[0].description;
      timeGreeting += ` | ${weather.name} | ${temp.toFixed(0)}°C, ${desc}`;
    }
    setGreeting(timeGreeting);
  }, [weather]);

  // Rotate weather facts
  useEffect(() => {
    let index = 0;
    setCurrentFact(weatherFacts[index]);
    const interval = setInterval(() => {
      index = (index + 1) % weatherFacts.length;
      setCurrentFact(weatherFacts[index]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle location search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      setSuggestions(mockLocations.filter((loc) => loc.toLowerCase().includes(query.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (location) => {
    setSearchQuery(location);
    setSuggestions([]);
  };

  const condition = weather?.weather[0].main;
  const theme = weatherThemes[condition] || weatherThemes["default"];
  const Icon = theme.icon;

  const weatherIconUrl = weather
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
    : "";

  return (
    <div className={`w-full min-h-screen flex flex-col text-gray-900 relative ${theme.bg} transition-all duration-1000`}>
      {/* Header */}
      <header className="w-full py-4 px-6 flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 mb-4 sm:mb-0">
          <Icon size={28} className="text-yellow-500 animate-spin-slow" /> ClimaMate
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
              <MapPin size={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search location..."
                className="bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none w-full"
                aria-label="Search for a location"
              />
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-2 z-30 max-h-60 overflow-y-auto">
                {suggestions.map((loc, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(loc)}
                    className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <nav className="flex gap-4">
            <Link to="/home">
              <button className="text-gray-900 font-medium px-6 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 transition duration-300 shadow-md">
                Get Started
              </button>
            </Link>
            <Link to="/about">
              <button className="text-gray-900 font-medium px-6 py-2 rounded-full hover:bg-gray-200 transition duration-300">
                About
              </button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-col lg:flex-row items-center justify-center flex-grow px-4 py-8 gap-8 max-w-7xl mx-auto relative z-10">
        {/* Left Column: Text and CTA */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight text-white drop-shadow-lg animate-slideIn">
            Discover ClimaMate
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-6 max-w-md mx-auto lg:mx-0 text-white/80 font-light animate-slideIn delay-100">
            Real-time weather updates and personalized insights to plan your day with confidence.
          </p>
          <Link to="/home" aria-label="Check the weather now">
            <button className="bg-yellow-400 text-gray-900 font-semibold px-8 py-3 rounded-full shadow-xl hover:bg-yellow-500 hover:scale-105 transform transition duration-300 animate-slideIn delay-200">
              Explore Weather Now
            </button>
          </Link>
        </div>

        {/* Right Column: Weather Info and Trivia */}
        <div className="flex-1 flex flex-col gap-6 max-w-md">
          {/* Current Weather Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl animate-slideIn delay-300">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-900">
              <MapPin size={20} className="text-yellow-500" /> Current Weather
            </h2>
            <p className="text-sm text-gray-700 mb-2">{greeting}</p>
            {weather ? (
              <div className="flex items-center justify-center gap-4">
                <img src={weatherIconUrl} alt={weather.weather[0].description} className="w-16 h-16 animate-pulse-slow" />
                <p className="text-lg font-medium text-gray-900">{getSuggestion(weather.main.temp, weather.weather[0].description)}</p>
              </div>
            ) : (
              <p className="text-gray-700">Loading current weather...</p>
            )}
          </div>

          {/* Weather Trivia Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl animate-slideIn delay-400">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-900">
              <Wind size={20} className="text-yellow-500" /> Weather Trivia
            </h2>
            <p className="text-sm text-gray-700">{currentFact}</p>
          </div>

          {/* Forecast Highlight Card */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl animate-slideIn delay-500">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-900">
              <Thermometer size={20} className="text-yellow-500" /> Forecast Highlight
            </h2>
            <div className="flex items-center gap-4">
              <Icon size={24} className="text-yellow-500" />
              <p className="text-sm text-gray-700">{theme.desc}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center bg-white/90 backdrop-blur-md mt-auto z-10">
        <p className="text-sm text-gray-600">© 2025 ClimaMate. All rights reserved.</p>
      </footer>

      {/* Animation Styles */}
      <style jsx="true">{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn { animation: slideIn 0.8s ease-out forwards; }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spinSlow 10s linear infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
};

export default LandingPage;