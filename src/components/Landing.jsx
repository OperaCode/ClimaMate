import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Sun, MapPin, Smartphone, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";

const getSuggestion = (temp, desc) => {
  if (!temp || !desc) return "";
  if (desc.includes("rain")) return "Don't forget your umbrella today!";
  if (temp > 30) return "Stay hydrated, it's quite hot today.";
  if (temp < 15) return "Wear a jacket, it's chilly.";
  return "It's a great day to be productive!";
};

const weatherThemes = {
  Clear: { bg: "bg-gradient-to-br from-yellow-400 via-orange-300 to-blue-300" },
  Rain: { bg: "bg-gradient-to-br from-gray-600 via-blue-700 to-teal-600" },
  Clouds: { bg: "bg-gradient-to-br from-gray-400 via-cyan-500 to-blue-400" },
  default: { bg: "bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-500" },
};

const LandingPage = () => {
  const [weather, setWeather] = useState(null);
  const [currentFact, setCurrentFact] = useState("");
  const [greeting, setGreeting] = useState("");

  const weatherFacts = [
    "Raindrops can fall at speeds of about 22 mph.",
    "Lightning is five times hotter than the sun’s surface.",
    "Snowflakes can take up to an hour to reach the ground.",
    "The highest temperature ever recorded was 56.7°C in Death Valley, USA.",
    "The coldest temperature recorded was -89.2°C in Antarctica.",
  ];

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  // fetch weather
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

  //time greeting
  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = "";
    if (hour < 6) timeGreeting = "Good evening";
    else if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 18) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";

    if (weather) {
      const temp = weather.main.temp;
      const desc = weather.weather[0].description;
      timeGreeting += ` | ${weather.name}: ${temp.toFixed(0)}°C, ${desc}`;
    }
    setGreeting(timeGreeting);
  }, [weather]);

  // generate randomfacts
  useEffect(() => {
    let index = 0;
    setCurrentFact(weatherFacts[index]);
    const interval = setInterval(() => {
      index = (index + 1) % weatherFacts.length;
      setCurrentFact(weatherFacts[index]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const condition = weather?.weather[0].main;
  console.log(condition)
  const theme = weatherThemes[condition] || weatherThemes["default"];
  const weatherIconUrl = weather
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
    : "";

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={`w-full min-h-screen flex flex-col ${theme.bg} text-white`}>
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white/10 backdrop-blur-md sticky top-0 z-20 shadow-md">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sun size={28} className="text-yellow-400 animate-spin-slow" />{" "}
          ClimaMate
        </h1>
        <nav className="flex gap-4">
          {["#Home", "#features", "#testimonials"].map((link, i) => (
            <a key={i} href={link}>
              <button className="text-white px-4 py-2 rounded-full hover:bg-white/20 transition">
                {link.replace("#", "").charAt(0).toUpperCase() + link.slice(2)}
              </button>
            </a>
          ))}
          <Link to="/home">
            <button className="bg-yellow-400 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition">
              Get Weather
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <motion.main
        id="top"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        variants={fadeInUp}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center px-4 py-30 text-center space-y-6  scroll-mt-10 "
      >
        <p className="text-xl sm:text-2xl font-semibold">{greeting}</p>
        {weather && (
          <motion.img
            src={weatherIconUrl}
            alt={weather.weather[0].description}
            className="w-24 h-24 animate-pulse-slow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Plan Your Day with ClimaMate
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-lg sm:text-xl md:text-2xl max-w-lg mx-auto font-light"
        >
          Live weather updates, daily suggestions, and trivia to brighten your
          day.
        </motion.p>
        <Link to="/home">
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-yellow-400 text-gray-800 px-10 py-4 rounded-full font-semibold shadow-xl hover:bg-yellow-500 transition"
          >
            Get Started
          </motion.button>
        </Link>
      </motion.main>

      {/* Features */}
      <motion.section
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 bg-white/10 backdrop-blur-md scroll-mt-8"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Features
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto text-center ">
          {[
            {
              icon: <MapPin size={48} className="m-auto" />,
              title: "Location-based Updates",
              desc: "Real-time weather for your current location.",
            },
            {
              icon: <Smartphone size={48} className="m-auto" />,
              title: "Responsive Design",
              desc: "Seamless experience on all devices.",
            },
            {
              icon: <CalendarCheck size={48} className="m-auto" />,
              title: "Daily Suggestions",
              desc: "Plan your outfits, travels, and tasks easily.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <div className="text-yellow-300 mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
      {/* how it works */}
      <motion.section
        id="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 bg-white/5 backdrop-blur-md scroll-mt-8"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold text-center mb-12"
        >
          How It Works
        </motion.h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              icon: <MapPin size={40} className="m-auto text-yellow-300" />,
              title: "1. Enter Location",
              desc: "Search for your city to get current weather instantly.",
            },
            {
              icon: <Sun size={40} className="m-auto text-yellow-300" />,
              title: "2. View Forecast",
              desc: "See live temperature, condition, and weather icon.",
            },
            {
              icon: (
                <CalendarCheck size={40} className="m-auto text-yellow-300" />
              ),
              title: "3. Plan Your Day",
              desc: "Get daily suggestions to stay prepared and productive.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.2, duration: 0.6 }}
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        id="testimonials"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 1 }}
        className="py-20 px-6 bg-white/5 backdrop-blur-md scroll-mt-8"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl font-bold text-center mb-12"
        >
          What Users Say
        </motion.h2>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-center">
          {[
            {
              name: "Aisha, Lagos",
              text: "ClimaMate has become my daily routine. I love the suggestions!",
            },
            {
              name: "Tunde, Abuja",
              text: "Super clean UI, accurate weather, and easy to use.",
            },
            {
              name: "Fatima, Kano",
              text: "I plan my dressing and trips easily now. Great app!",
            },
            {
              name: "Chinedu, Enugu",
              text: "Fast, reliable, and beautifully designed weather updates.",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.3 }}
              className="bg-white/10 p-6 rounded-xl shadow-lg"
            >
              <p className="italic">"{testimonial.text}"</p>
              <h4 className="mt-4 font-semibold">– {testimonial.name}</h4>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
        className="py-20 px-6 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">
          Ready to check your weather?
        </h2>
        <Link to="/home">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-gray-800 px-10 py-4 rounded-full font-semibold shadow-xl hover:bg-yellow-500 transition"
          >
            Get Started Now
          </motion.button>
        </Link>
      </motion.section>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center bg-white/10 backdrop-blur-md mt-auto">
        <p className="text-sm">© 2025 ClimaMate. Plan your day smarter.</p>
      </footer>

      {/* Animations */}
      <style jsx="true">{`
        html {
          scroll-behavior: smooth;
        }
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
        @keyframes pulseSlow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
