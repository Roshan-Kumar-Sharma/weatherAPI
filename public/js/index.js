const weatherContainer = document.querySelector("#weather-container");
const cityName = document.querySelector("#city-names");

document.querySelector("#username").addEventListener("blur", (e) => {
    console.log("bulre");
    document.querySelector(
        "#user-name"
    ).innerHTML = `<h3>Welcome ${e.target.value}!</h3>`;
});

cityName.addEventListener("submit", async (e) => {
    e.preventDefault();

    weatherContainer.innerHTML = "";

    let names = cityName.cities.value.split(",");

    for (let i = 0; i < names.length; i++) {
        names[i] = names[i].trim();
    }

    cityName.cities.value = "";

    try {
        const ResponseObj = await fetch(`/weather`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cities: names,
            }),
        });

        const response = await ResponseObj.json();

        renderWeatherDetails(response);
    } catch (err) {
        console.log(err.message);
    }
});

function renderWeatherDetails(response) {
    if (!response.citiesTemp.length) {
        weatherContainer.innerHTML = `<div class="text-danger">All the entered countries/cities names are invalid</div>`;
    } else {
        response.citiesTemp.forEach((city) => {
            const { name } = city;
            const { icon, description } = city.weather[0];
            const { temp, humidity } = city.main;
            const { speed } = city.wind;
            const HTMLDom = HTML(`<div class="bg-light p-3 my-2">
                    <h2>Temperature in ${name}</h2>
                    <h1 class="text-primary">${temp}°C</h1>
                    <div class="flex">
                        <img
                            src="https://openweathermap.org/img/wn/${icon}.png"
                            alt="No Icon Available"
                        />
                        <div>
                            Weather: <span class="text-primary">${description}</span>
                        </div>
                    </div>
                    <div>
                        Humidity: <span class="text-primary">${humidity}%</span>
                    </div>
                    <div>Wind: <span class="text-primary">${speed} km/h</span></div>
                </div>`);

            weatherContainer.append(HTMLDom);
        });

        if (response.invalidCities.length) {
            const invalidCitiesName = response.invalidCities.join(", ");

            weatherContainer.innerHTML += `<br/><div class="">Invalid Countries/Cities Entered:<br/> <span class="text-danger">${invalidCitiesName}</span></div>`;
        }
    }
}

function HTML(dom) {
    const template = document.createElement("template");
    template.innerHTML = dom;
    return template.content.firstChild;
}
