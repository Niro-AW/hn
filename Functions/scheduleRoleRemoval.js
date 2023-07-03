const tempRoleSchema = require("../Models/Role");

async function scheduleRoleRemoval(client, userId, roleId, guildId, expiresAt) {
    const timeLeft = expiresAt.getTime() - Date.now();

    setTimeout(async () => {
        const guild = client.guilds.cache.get(guildId);
        const member = await guild.members.fetch(userId);

        if (member.roles.cache.has(roleId)) {
            try {
                await member.roles.remove(roleId)
                console.log(`Removed expired role ${roleId} from user ${userId}`)
            } catch (error) {
                console.error(`Failed to remove expired role: ${error}`)
            }
        }

        await tempRoleSchema.deleteOne({ guildId, userId, roleId,});
    }, timeLeft)
}

module.exports = scheduleRoleRemoval;