let { model, Schema } = require("mongoose");

let tempRoleSchema = new Schema({
    guildId: String,
    userId: String,
    roleId: String,
    expiresAt: { type: Date, expires: 0 },
});

module.exports = model("TempRole", tempRoleSchema)