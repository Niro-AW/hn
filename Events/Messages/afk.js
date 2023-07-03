const afkModel = require("../../Models/Afk");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot || !message.guild) return;


        afkModel.findOne({ Guild: message.guild.id, UserID: message.author.id }, async (err, data) => {
            if(!data) return;
            if (data.Afk) {
                data.Afk = false;
                data.save();
            }
            return;
        });

        const taggedMembers = message.mentions.users.map(msg => msg.id);

        if (taggedMembers.length > 0) {
            taggedMembers.forEach(m => {
                afkModel.findOne({ Guild: message.guild.id, UserID: m }, async (err, data) => {
                    if (data.Afk) {
                        if(!data) return;
                        message.reply("This user is currently **afk**.");
                    }
                    return;
                })
            })
        }
    }
}