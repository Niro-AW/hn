const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const tempRoleSchema = require("../../Models/Role");
const scheduleRoleRemoval = require("../../Functions/scheduleRoleRemoval");

function formatTimestamp(date) {
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    return `<t:${unixTimestamp}:R>`
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName("temp-role")
    .setDescription("Temporarily add a role to a user.")
    .addUserOption(option =>
        option.setName("user")
        .setDescription("The user to add the role to.")
        .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName("role")
            .setDescription("The role to add to the user")
            .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName("duration")
                .setDescription("The duration in minutes for the role to be added to the user.")
                .setRequired(true)
                )
                .addBooleanOption(option =>
                    option.setName("dm")
                    .setDescription("whether to DM the user about the temporary role.")
                    .setRequired(false)
                    ),

                    async execute(interaction) {
                        try {
                            const user = interaction.options.getUser("user");
                            const role = interaction.options.getRole("role");
                            const duration = interaction.options.getInteger("duration");
                            const member = await interaction.guild.members.fetch(user.id);
                            const dm = interaction.options.getBoolean("dm") || false;
                            const expiresAt = new Date(Date.now() + duration * 60000);

                            if(member.roles.cache.has(role.id)) {
                                const embed = new EmbedBuilder()
                                .setColor("#ff0000")
                                .setDescription(`User ${user} already has the role \`${role.name}\`.`)
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
                            
                            await interaction.guild.members.cache.get(user.id).roles.add(role);

                            const tempRole = new tempRoleSchema({
                                guildId: interaction.guild.id,
                                userId: user.id,
                                roleId: role.id,
                                expiresAt,
                            });

                            await tempRole.save()

                            scheduleRoleRemoval(
                                interaction.client,
                                user.id,
                                role.id,
                                interaction.guild.id,
                                expiresAt
                            );

                            if (dm) {
                                const timestamp = formatTimestamp(expiresAt);
                                const message = `You habe been given the temporary role \`${role.name}\` for ${duration} in the guild \`${interaction.guild.name}\`. It will expire ${duration}.`
                                try {
                                    await user.send(message);
                                } catch (error) {
                                    console.error(`Failed to send DM to user ${user.id}: ${error}`)
                                }
                            }

                            const timestamp = formatTimestamp(expiresAt);

                            const embed = new EmbedBuilder()
                            .setColor("#00ff00")
                            .setDescription(
                                `The role \`${
                                    role.name
                                }\` has been added to ${user.toString()} for ${duration} minute(s). It will expire ${timestamp}. `
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
                        } catch (error) {
                            console.error(error)
                            await interaction.reply({
                                content: "An error occurred while executing the command.",
                                ephemeral: true
                            })
                        }
                    }
}