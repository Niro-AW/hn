const { Client, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");
const { loadEvents } = require("../../Handlers/eventHandler");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload your commands or your events.")
    .addSubcommand(subcommand =>
    subcommand.setName("commands")
    .setDescription("Reload your commands")    
    )
    .addSubcommand(subcommand =>
        subcommand.setName("events")
        .setDescription("Reload your events")    
        ),

        async execute(interaction, client) {

            const { user } = interaction;

            if (user.id !== "841834186918330380") return interaction.reply({
                embeds: [new EmbedBuilder()
                .setColor("Red").setDescription("This command is only for the bot developers!")], ephemeral: true
            })

            const sub = interaction.options.getSubcommand()
            const embed = new EmbedBuilder()
            .setTitle("💻 Developer")
            .setColor("Blue")

            switch (sub) {
                case "commands": {
                    loadCommands(client)
                    interaction.reply({ embeds: [embed.setDescription("✅ Commands reloaded!")] })
                    console.log(`${user} has reloaded the commands.`)
                }
                break;
                case "events": {
                    loadEvents(client)
                    interaction.reply({ embeds: [embed.setDescription("✅ Events reloaded!")] })
                    console.log(`${user} has reloaded the events.`)
                }
                break;
                }
        }
}