// const fetch = require('node-fetch'); // If you're using Node.js, install node-fetch library

// Define your API keys
const newsApiKey = 'b83c45154a7546218ef532c75720999f';
const googleGeocodeApiKey = 'AIzaSyBRkM4p07y2CoQshY7Xe37yaZ0zpgPEsr8';

// Target coordinates (e.g., from user input)
const targetLat = 28.7041; // Example: Latitude of Delhi
const targetLon = 77.1025; // Example: Longitude of Delhi

// Radius to check for nearby disasters (in kilometers)
const radius = 100;

// Haversine formula to calculate distance between two geo-coordinates
function toRad(degree) {
  return degree * Math.PI / 180;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

// Fetch disaster news
async function fetchDisasterNews() {
  const url = `https://newsapi.org/v2/everything?q=disaster&country=in&apiKey=${newsApiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.articles;
}

// Get latitude and longitude from city using Google Geocoding API
async function getLatLonFromCity(city) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${googleGeocodeApiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lon: location.lng };
  } else {
    throw new Error('City not found');
  }
}

// Check if disaster is within the target radius
async function checkNearbyDisasters() {
  const newsArticles = await fetchDisasterNews();
  
  for (let article of newsArticles) {
    const articleTitle = article.title;
    const articleContent = article.content || '';
    const cities = extractCitiesFromText(articleTitle + ' ' + articleContent);

    for (let city of cities) {
      try {
        const { lat: disasterLat, lon: disasterLon } = await getLatLonFromCity(city);
        const distance = haversine(targetLat, targetLon, disasterLat, disasterLon);
        if (distance < radius) {
          console.log(`Disaster found near ${city} at a distance of ${distance} km.`);
          return; // Exit if disaster is found nearby
        }
      } catch (error) {
        console.log(`Error geocoding city: ${city}`);
      }
    }
  }

  // If no disaster found within the radius, trigger campaign creation
  triggerCampaignCreation();
}

// Extract city names from text using a simple regex (could be enhanced with NLP)
function extractCitiesFromText(text) {
  const cityPattern = /\b([A-Z][a-z]+(?: [A-Z][a-z]+)*)\b/g;  // Basic pattern for city names
  return text.match(cityPattern) || [];
}

// Trigger campaign creation if no disaster found
function triggerCampaignCreation() {
  console.log("No nearby disasters found. Creating a new campaign...");
  
  // Example: Sending request to an API to create the campaign
  const campaignData = {
    title: 'New Campaign for Disaster Preparedness',
    description: 'We need to raise awareness for disaster preparedness in your area.',
    targetLocation: { lat: targetLat, lon: targetLon }
  };

  // Send campaign data (replace with your campaign creation API)
  fetch('https://your-api.com/create-campaign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaignData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Campaign created successfully:', data);
  })
  .catch(error => {
    console.log('Error creating campaign:', error);
  });
}

// Run the check
checkNearbyDisasters();