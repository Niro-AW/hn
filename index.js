const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

const dotenv = require('dotenv');

dotenv.config();

const logs = require("discord-logs");

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const { handleLogs } = require("./Handlers/handleLogs");
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
});

logs(client, {
  debug: true
});

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true, // you can change this to your needs
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()]
});

client.commands = new Collection();
client.config = require("./config.json");
client.giveawayConfig = require("./config.js");

['giveawaysEventsHandler', 'giveawaysManager'].forEach((x) => { // make sure it's in the right order
  require(`./Utils/${x}`)(client);
})

module.exports = client;

client.login(process.env.token).then(() => {
  handleLogs(client);
  loadEvents(client);
  loadCommands(client);
});