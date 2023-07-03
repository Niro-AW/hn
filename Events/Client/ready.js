const { Client } = require('discord.js');
const mongoose = require('mongoose');
const config = require("../../config.json");
const Levels = require("discord.js-leveling");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        await mongoose.connect(config.mongodb || '', {
            keepAlive: true,
        });

        if (mongoose.connect) {
            console.log('MongoDB connection succesful.')
        }

        Levels.setURL(config.mongodb);

        console.log(`${client.user.username} is now online.`);
    },
};