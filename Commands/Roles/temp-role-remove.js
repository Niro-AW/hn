const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const tempRoleSchema = require("../../Models/Role");
const scheduleRoleAdd = require("../../Functions/scheduleRoleAdd");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("temp-remove")
    .setDescription("Temporarily remove a role from a user.")
    .addUserOption(option =>
        option.setName("user")
        .setDescription("The user to remove the role from.")
        .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("role")
            .setDescription("The role to remove from the user")
            .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName("duration")
                .setDescription("The duration in minutes for the role to be removed from the user.")
                .setRequired(true)
                ),

                    async execute(interaction) {
                            const user = interaction.options.getUser("user");
                            const role = interaction.options.getRole("role");
                            const duration = interaction.options.getInteger("duration");
                            const member = await interaction.guild.members.fetch(user.id);
                            const expiresAt = new Date(Date.now() + duration * 60000);

                            if(!member.roles.cache.has(role.id)) {
                                const embed = new EmbedBuilder()
                                .setColor("#ff0000")
                                .setDescription(`User ${user} doesn't have the role \`${role.name}\`.`)
                                .setAuthor({
                                    name: interaction.user.tag,
                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                                })
                                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                                .setTimestamp()

                                await interaction.reply({ 
                                    embeds: [embed],
                                    ephemeral: true 
                                });
                                return;
                            }
                            
                            await interaction.guild.members.cache.get(user.id).roles.remove(role);

                            const tempRole = new tempRoleSchema({
                                guildId: interaction.guild.id,
                                userId: user.id,
                                roleId: role.id,
                                expiresAt,
                            });

                            await tempRole.save()

                            scheduleRoleAdd(
                                interaction.client,
                                user.id,
                                role.id,
                                interaction.guild.id,
                                expiresAt
                            );

                            const expiresAtUnix = Math.floor(expiresAt.getTime() / 1000);
                            const timestamp = `<t:${expiresAtUnix}:R>`

                            const embed = new EmbedBuilder()
                            .setColor("#00ff00")
                            .setDescription(
                                `The role \`${
                                    role.name
                                }\` has been removed from ${user.toString()} for ${duration} minute(s). It will be added back ${timestamp}. `
                            )
                            .setAuthor({
                                name: interaction.user.tag,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                            })
                            .setFooter({ text: `Requested by ${interaction.user.tag}` })
                            .setTimestamp()

                            await interaction.reply({ 
                                embeds: [embed],
                                ephemeral: true 
                            });
                    }
}