const countingScheme = require("../../Models/Counting");

const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageDelete",

    async execute(message) {
        
        const guildId = message.guild.id;

        if(message.author.bot) return;

        if(isNaN(message.content)) return;

        countingScheme.findOne({ GuildID: guildId }, async (err, data) => {
            if (!data ||!data.Channel) return;

            if(message.channel.id === data.Channel) {
                const embed = new EmbedBuilder()
                .setDescription(`**Watch out!** ${message.author} counted and then deleted their message.\nLast number was \`${message.content}\` `)
                .setColor("#FF5599")
                .setTimestamp()

                message.channel.send({ embeds: [embed] })
            }

            if (err) {
                console.log(err);
            }

        })
    }
}