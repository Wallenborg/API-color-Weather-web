document.addEventListener("DOMContentLoaded", () => {
  let colorPicker1El = document.querySelector("#color1");
  let colorPicker2El = document.querySelector("#color2");
  let rgbResultsEL = document.querySelector("#rgb-results");

  colorPicker1El.addEventListener("input", updateBackgroundColor);
  colorPicker2El.addEventListener("input", updateBackgroundColor);

  async function updateBackgroundColor() {
    const url = "https://open-weather13.p.rapidapi.com/city/stockholm";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "48a5937b2cmsh17d1fd373cc39bcp1e33fdjsn60bd102a98e2",
        "X-RapidAPI-Host": "open-weather13.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json(); // Use response.json() to parse JSON data
      console.log(data); // Log the parsed JSON data

      // To get the info from openweathermap data.main.temp and save as temperatureInCelsius
      let temperatureInCelsius = Math.round((data.main.temp - 32) * (5 / 9)); // Convert temperature from Fahrenheit to Celsius and round to the nearest whole number
      //
      console.log(temperatureInCelsius);

      // Get user-selected colors
      let color1 = colorPicker1El.value;
      let color2 = colorPicker2El.value;

      // Set background color based on temperature and user-selected colors
      let backgroundColor = calculateBackgroundColor(
        temperatureInCelsius,
        color1,
        color2
      );
      document.body.style.backgroundColor = backgroundColor;

      // Display New RGB code on site
      rgbResultsEL.innerHTML = backgroundColor;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Initial call to set the background color when the page loads
  updateBackgroundColor();
});

function calculateBackgroundColor(temperature, color1, color2) {
  let normalizedTemperature = (temperature + 40) / 80; // Normalize temperature to the range [0, 1]

  // Interpolate between color1 and color2 based on normalized temperature
  let r = Math.round(
    interpolate(
      color1.substring(1, 3),
      color2.substring(1, 3),
      normalizedTemperature
    )
  );
  let g = Math.round(
    interpolate(
      color1.substring(3, 5),
      color2.substring(3, 5),
      normalizedTemperature
    )
  );
  let b = Math.round(
    interpolate(
      color1.substring(5, 7),
      color2.substring(5, 7),
      normalizedTemperature
    )
  );

  return `rgb(${r}, ${g}, ${b})`;
}

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
