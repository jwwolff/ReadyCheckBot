require("dotenv").config();
const wait = require("node:timers/promises").setTimeout;
const {
  Client,
  IntentsBitField,
  ButtonStyle
} = require("discord.js");

const { handleInteractions } = require("./handleInteractions");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildVoiceStates,
    //IntentsBitField.Flags.GuildMessages,
    // IntentsBitField.Flags.GuildMessageReactions,
  ],
});

client.on("interactionCreate", handleInteractions);

client.login(process.env.TOKEN);
