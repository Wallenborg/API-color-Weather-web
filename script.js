/* This code fetches weather data from the OpenWeatherMap API, 
calculates a background color based on the temperature 
and user-selected colors, and updates the background color */

// Code inside this function will run when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  let colorPicker1El = document.querySelector("#color1");
  let colorPicker2El = document.querySelector("#color2");
  let rgbResultsEL = document.querySelector("#rgb-results");
  // variabel to save the last temperaturefetched from the API
  let lastTemperature = null;

  //select and place  a event listener input from type="color" and a function.
  colorPicker1El.addEventListener("input", updateBackgroundColor);
  colorPicker2El.addEventListener("input", updateBackgroundColor);

  //  Gets the temperature either from the last saved value or if not then the API,
  async function updateBackgroundColor() {
    try {
      let temperatureInCelsius;
      // if temp lastTemperature not = empty it takes the last value saved.
      if (lastTemperature !== null) {
        temperatureInCelsius = lastTemperature;
      } else {
        const data = await getData();
        temperatureInCelsius = data.temperature;
        lastTemperature = temperatureInCelsius;
      }

      // Get user-selected colors
      let color1 = colorPicker1El.value;
      let color2 = colorPicker2El.value;
      console.log("color1", color1);
      console.log("color2", color2);

      // Set background color based on temperature and user-selected colors
      let backgroundColor = calculateBackgroundColor(
        temperatureInCelsius,
        color1,
        color2
      );

      document.body.style.backgroundColor = backgroundColor;
      console.log("background Color", backgroundColor);

      //display New rbg code on site
      rgbResultsEL.textContent = backgroundColor;
    } catch (error) {
      console.error("Error fetching data:", error); // catch error and show it
    }
  }

  // call to set the background color.
  updateBackgroundColor();
});

//Get temp from the API, and saves it for later use.
async function getData() {
  try {
    const res = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Stockholm&appid=76ace1dc563fa0f92a3353bb1bf7bfe8"
    ); // get the data
    const data = await res.json(); // wait for the data to be run

    console.log(data);
    // To get the info from openweathermap data.main.temp and save as temperatureInCelsius
    let temperatureInCelsius = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
    console.log(temperatureInCelsius, "Celsius");
    return { temperature: temperatureInCelsius }; // Return an object with temperature property
  } catch (error) {
    console.error("Error fetching data:", error); // Catch error and show it
  }
}

// this  function calculation is written using chatGPT3 and google.
function calculateBackgroundColor(temperature, color1, color2) {
  let normalizedTemperature = (temperature + 40) / 80; // Normalize temperature to the range [0, 1]
  console.log("temperature", temperature);
  // Interpolate between color1 and color2 based on normalized temperature

  /*The substring(1, 3) is used to extract a specific portion of a color string. 
  In this context, it is used to extract the individual components (red, green, and blue) 
  of the hexadecimal color codes. In a hexadecimal color code, each component is represented by two characters. 
  For example, in the color code "#RRGGBB", the first two characters represent the red component, 
  the next two represent the green component, and the last two represent the blue component.
  So, substring(1, 3) is extracting the characters at indices 1 and 2 from the color string,
   effectively giving you the red component of the color.*/

  let redRGB = Math.round(
    interpolate(
      color1.substring(1, 3),
      color2.substring(1, 3),
      normalizedTemperature
    )
  );
  let greenRGB = Math.round(
    interpolate(
      color1.substring(3, 5),
      color2.substring(3, 5),
      normalizedTemperature
    )
  );
  let blueRGB = Math.round(
    interpolate(
      color1.substring(5, 7),
      color2.substring(5, 7),
      normalizedTemperature
    )
  );

  return `rgb(${redRGB}, ${greenRGB}, ${blueRGB})`;
}
//parseInt(color1, 16) converts the hexadecimal string color1 to its decimal equivalent
//if color1 is "9a" in hexadecimal, parseInt(color1, 16) will convert it to the decimal value 154
function interpolate(color1, color2, factor) {
  return parseInt(color1, 16) * (1 - factor) + parseInt(color2, 16) * factor;
}

//-------
// Modal
//-------

let modalToggleEl = document.querySelector("#modalToggle");
let modalEl = document.querySelector("#modal");
let modalInnerEl = modalEl.querySelector(".modal__inner");

modalToggleEl.addEventListener("click", function () {
  modalEl.classList.add("modal--show");
});

modalEl.addEventListener("click", function () {
  modalEl.classList.remove("modal--show");
});
