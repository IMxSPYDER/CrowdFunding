import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import disasterData from "./disasterData.json";

const API_KEY = "8eab9e0c8f2c65b31456e247fe2f9f5e"; // Replace with your OpenWeather API key

const DisasterCheckForm = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingDisaster, setCheckingDisaster] = useState(false);
  const navigate = useNavigate();

  const fetchLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(2));
          const lon = parseFloat(position.coords.longitude.toFixed(2));

          setLocation({ lat, lon });
          fetchWeather(lat, lon); // Fetch weather after getting location
          setLoading(false);
        },
        (err) => {
          setError(`Error: ${err.message}`);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=96c8e9780b58ceb47c946c541733c8bc`
      );
      const data = await response.json();
      console.log("Weather API Response:", data); // Debugging
  
      if (response.ok) {
        setWeather({
          temperature: data.main.temp,
          condition: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
      } else {
        setError(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Weather API Fetch Error:", error);
      setError("Unable to fetch weather data. Check API key or internet.");
    }
  };
  

  useEffect(() => {
    fetchLocation();
  }, []);

  const checkDisasterStatus = () => {
    if (!location.lat || !location.lon) {
      alert("Invalid location. Please enable GPS.");
      return;
    }

    setCheckingDisaster(true);

    try {
      const tolerance = 0.001;
      const foundDisaster = disasterData.find(
        (data) =>
          Math.abs(data.lat - location.lat) <= tolerance &&
          Math.abs(data.lon - location.lon) <= tolerance
      );

      if (foundDisaster) {
        if (foundDisaster.isDisaster) {
          navigate("/create-campaign");
        } else {
          alert("No disaster detected at this location.");
        }
      } else {
        alert("Location not found in disaster data.");
      }
    } catch (error) {
      console.error("Error checking disaster status:", error);
      alert("Error checking disaster status. Try again later.");
    } finally {
      setCheckingDisaster(false);
    }
  };

  return (
    <div className="bg-[#d4d4d4] flex flex-col justify-center items-center rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-4 sm:min-w-[380px] bg-[#8b8b8b] rounded-[10px]">
        <h2 className="font-epilogue font-bold text-[18px] sm:text-[25px] text-grey">
          Get Location & Weather
        </h2>
      </div>
      {loading ? (
        <p className="text-black mt-4">Fetching location...</p>
      ) : error ? (
        <div className="mt-4">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-3 bg-[#f04e4e] px-4 py-2 rounded text-white font-bold hover:bg-[#c93d3d] transition"
            onClick={fetchLocation}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="mt-6 text-black text-[16px] text-center">
        <div className="flex flex-row gap-3 justify-center">
        <div className="item-center">
          <p className="text-md font-semibold">Latitude: {location.lat}</p>
          <p className="text-md font-semibold">Longitude: {location.lon}</p>
        </div>

          {/* Weather Data */}
          {weather && (
            <div className="flex flex-col items-center">
              <p className="text-black text-lg font-semibold">Weather Status: {weather.condition}</p>
              <p className="text-black text-lg font-semibold">Temp: {weather.temperature}°C</p>
              {/* <img src={weather.icon} alt="Weather icon" className="w-16 h-16" /> */}
            </div>
          )}
          </div>
          {/* Google Map */}
          {location.lat && location.lon && (
            <iframe
              className="mt-4 rounded-lg border-2 border-[#3a3a43]"
              width="100%"
              height="300"
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyB8OfKkaQiUmGzdNr3c6ONr7FH8yQJrSXE&center=${location.lat},${location.lon}&zoom=15`}
            ></iframe>
          )}

          <button
            className="mt-6 bg-blue-400 px-6 py-3 rounded-[8px] text-white font-bold hover:bg-[#4292fc] transition"
            onClick={checkDisasterStatus}
            disabled={checkingDisaster}
          >
            {checkingDisaster ? "Checking..." : "Check Disaster"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DisasterCheckForm;
