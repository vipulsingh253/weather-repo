# Weather App

A simple weather forecast app that shows current weather and 5-day forecast for any city.

## What it does

- Shows current weather for any city you search
- 5-day weather forecast 
- Can use your current location
- Remembers your recent searches
- Warns you if temperature is really high (over 40°C)
- Works on mobile and desktop

## How to set it up

First you need to get an API key from OpenWeatherMap:
1. Go to https://openweathermap.org/api 
2. Sign up for free account
3. Get your API key

Then update the code:
1. Open index.js file
2. Find this line: `const apiKey = "f695f305cfe5e8ae91cb87b5afb45649";`
3. Replace it with your API key

You also need these icon images in an "images" folder:
- search.png
- current location.png  
- clear.png
- clouds.png
- rain.png
- drizzle.png
- mist.png
- snow.png
- humidity.png
- wind.png

Just open index.html in your browser and it should work.

## How to use it

**Search for a city:**
Type city name and click search button or press Enter

**Use your location:**
Click the location button and allow location access

**Recent searches:**
The app remembers your last 5 searches in a dropdown

## Files in the project

- index.html - the main page
- index.js - all the JavaScript code  
- images/ - folder with all the weather icons

## What APIs it uses

- OpenWeatherMap for current weather
- OpenWeatherMap for 5-day forecast
- Browser geolocation to find your location

## Technical stuff

Built with:
- HTML
- JavaScript
- Tailwind CSS for styling
- Uses localStorage to save recent searches

## Common problems

**API not working:**
- Make sure your API key is correct
- Check if you hit the free usage limit

**Location button not working:**
- Enable location in your browser settings
- Some browsers need HTTPS to use location

**Missing icons:**
- Make sure all image files are in the images folder
- Check the file names are exactly right

## Browser support

Works on modern browsers like Chrome, Firefox, Safari, Edge.

