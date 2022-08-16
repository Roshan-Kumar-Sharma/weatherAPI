const express = require("express");
const path = require("path");

module.exports = (app) => {
    const staticPath = path.join(__dirname, "..", "public");

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(staticPath));
};
