require("dotenv").config();

const express = require("express");
const axios = require("axios").default;

const app = express();

require("./configs/app.configs")(app);

const path = __dirname + "/public";

app.get("/", (req, res, next) => {
    res.sendFile(path + "/html/index.html");
});

app.post("/getWeather", async (req, res, next) => {
    const { cities } = req.body;

    for (let i = 0; i < cities.length; i++) {
        cities[i] = cities[i].trim();
    }

    let response = {
        weather: {},
    };

    for (let city = 0; city < cities.length; city++) {
        const weatherDetails = await getWeather(cities[city]);

        if (weatherDetails.status == 200) {
            response.weather[cities[city]] =
                weatherDetails.data.main.temp + "C";
        }
    }
    res.json(response);
});

app.post("/weather", async (req, res, next) => {
    const { cities } = req.body;

    let response = {
        citiesTemp: [],
        invalidCities: [],
    };

    for (let city = 0; city < cities.length; city++) {
        const weatherDetails = await getWeather(cities[city]);
        if (weatherDetails.status !== 200) {
            response.invalidCities.push(cities[city]);
        } else {
            response.citiesTemp.push({
                weather: weatherDetails.data.weather,
                main: weatherDetails.data.main,
                name: weatherDetails.data.name,
                wind: weatherDetails.data.wind,
            });
        }
    }

    res.json(response);
});

async function getWeather(city) {
    try {
        const ResponseObj = await axios({
            method: "post",
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`,
        });

        return ResponseObj;
    } catch (err) {
        return err.response;
    }
}

app.listen(process.env.PORT || 5000, () => {
    console.log(
        `Server is running at port ${
            process.env.PORT ? process.env.PORT : 5000
        }`
    );
});
