const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const countingScheme = require("../../Models/Counting")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("counting")
    .setDescription("Configure the counting system.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand(subcommand =>
    subcommand.setName("setup")
    .setDescription("Setup the counting system")
    .addChannelOption(option =>
    option.setName("channel")
    .setDescription("Channel to listen for counting.")
    .addChannelTypes(ChannelType.GuildText)
    .setRequired(true)    
    )    
    )
    .addSubcommand(subcommand =>
    subcommand.setName("mute")
    .setDescription("Mute someone from the counting channel")
    .addUserOption(option =>
    option.setName("user")
    .setDescription("User to mute")
    .setRequired(true)    
    )    
    )
    .addSubcommand(subcommand =>
        subcommand.setName("unmute")
        .setDescription("Unmute someone from the counting channel")
        .addUserOption(option =>
        option.setName("user")
        .setDescription("User to unmute")
        .setRequired(true)    
        )    
        ),

        async execute(interaction) {
            const { options, guildId, guild, member } = interaction;

            const subcommand = options.getSubcommand()

            const channel = options.getChannel("channel")
            const user = options.getUser("user")

            const errEmbed = new EmbedBuilder()
            .setDescription("An error occured")
            .setColor("Red")
            .setTimestamp()

            switch (subcommand) {
                case "setup":
                    countingScheme.findOne({ GuildID: guildId }, async (err, data) => {
                        if(!data) {
                        await countingScheme.create({
                            GuildID: guildId,
                            Channel: channel.id,
                            Count: 1,
                            LastPerson: ""
                        });
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`Succesfully set up the counting system in ${channel}.`)
                                .setColor("#FF5599")
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })
                        
                    } else if (data) {
                        data.Channel = channel.id
                        data.save()

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`Succesfully replaced old channel with ${channel}.`)
                                .setColor("#FF5599")
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })
                    }
                    if (err) {
                        return interaction.reply({
                            embeds: [errEmbed],
                            ephemeral: true
                        })
                    }
            });
            break;
            case "mute":
                countingScheme.findOne({ GuildID: guildId }, async (err, data) => {
                    if(!data) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`You need to set up your counting system first.`)
                                .setColor("#FF5599")
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })
                    } else if (data) {
                        const ch = guild.channels.cache.get(data.Channel)

                        ch.permissionOverwrites.edit(user.id, { SendMessages: false });

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setFooter({ text: `${member.user.tag}`, iconURL: member.displayAvatarURL() })
                                .setDescription(`You have succesfully muted ${user}.`)
                                .setColor("#FF5599")
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })
                    }
                    if (err) {
                        return interaction.reply({ embeds: [errEmbed], ephemeral: true })
                    }
                })
                break;
                case "unmute":
                    countingScheme.findOne({ GuildID: guildId }, async (err, data) => {
                        if(!data) {
                            return interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setDescription(`You need to set up your counting system first.`)
                                    .setColor("#FF5599")
                                    .setTimestamp()
                                ],
                                ephemeral: true
                            })
                        } else if (data) {
                            const ch = guild.channels.cache.get(data.Channel)
    
                            ch.permissionOverwrites.edit(user.id, { SendMessages: true });
    
                            return interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setFooter({ text: `${member.user.tag}`, iconURL: member.displayAvatarURL() })
                                    .setDescription(`You have succesfully unmuted ${user}.`)
                                    .setColor("#FF5599")
                                    .setTimestamp()
                                ],
                                ephemeral: true
                            })
                        }
                        if (err) {
                            return interaction.reply({ embeds: [errEmbed], ephemeral: true })
                        }
                    })
                    break;   
        }
}
}
