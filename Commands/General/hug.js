const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const hugs = [
  "https://media.giphy.com/media/lrr9rHuoJOE0w/giphy.gif",
  "https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif",
  "https://media.giphy.com/media/LIqFOpO9Qh0uA/giphy.gif",
  "https://media.tenor.com/UUDWXyIeKvkAAAAC/hug.gif",
  "https://media.tenor.com/dI_LcyWYuLMAAAAC/hug-anime.gif",
  "https://media.tenor.com/LAyPORbxIQsAAAAC/hug.gif",
];
module.exports = {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Give the user a hug!")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Who do you want to hug?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member } = interaction;

    const user = options.getUser("target");

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Random")
          .setImage(hugs[Math.floor(Math.random() * hugs.length)])
          .setDescription(`${member} hugged ${user}!`),
      ],
    });
  },
};