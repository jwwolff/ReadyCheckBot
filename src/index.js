require("dotenv").config();
const wait = require("node:timers/promises").setTimeout;
const {
  Client,
  IntentsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  createAudioResource,
} = require("@discordjs/voice");
const { join } = require("node:path");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildVoiceStates,
    //IntentsBitField.Flags.GuildMessages,
    // IntentsBitField.Flags.GuildMessageReactions,
  ],
});

var ReadyCount = 0;
var NotReadyCount = 0;

const readystate = [
  {
    Label: "ready",
    ButtonStyle: ButtonStyle.Success,
    id: "1",
  },
  {
    Label: "not ready",
    ButtonStyle: ButtonStyle.Danger,
    id: "0",
  },
];

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
  },
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (
      interaction.commandName === "ready-check" ||
      interaction.commandName === "readycheck" ||
      interaction.commandName === "rcheck"
    ) {
      ReadyCount = 0;
      NotReadyCount = 0;
      
      var voiceChannel = await interaction.member.voice.channel;
      if (!voiceChannel) return;
      var memberCount = voiceChannel.members.size - 1;
      console.log(voiceChannel.members.size - 1);

      const row = new ActionRowBuilder();

      readystate.forEach((state) => {
        row.components.push(
          new ButtonBuilder()
            .setLabel(state.Label)
            .setStyle(state.ButtonStyle)
            .setCustomId(state.id)
        );
      });

      await interaction.reply({
        components: [row],
      });

      //VC vode
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      let StartReadyCheck = createAudioResource(
        join(__dirname, "Ready_Check.mp3")
      );
      connection.subscribe(player);
      player.play(StartReadyCheck);

      //TODO: fix this stupid wait statement
      var waitTime = 0;
      while (waitTime != 30) {
        await wait(1000);
        if (NotReadyCount + ReadyCount >= memberCount) {
          waitTime = 30;
        } else {
          waitTime += 1;
        }
      }

      if (ReadyCount == memberCount) {
        await interaction.editReply({
          content: "Ready Check: **PASSED**",
          components: [],
        });

        let ReadyCheckPassed = createAudioResource(
          join(__dirname, "All_Ready.mp3")
        );

        player.play(ReadyCheckPassed);
      } else {
        await interaction.editReply({
          content: `Ready Check: **FAILED** (${NotReadyCount})`,
          components: [],
        });

        let ReadyCheckFailed = createAudioResource(
          join(__dirname, "Not_Ready.mp3")
        );

        player.play(ReadyCheckFailed);
      }

      await wait(30000);
      if(connection) await connection.destroy();
      await interaction.deleteReply();
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === "1") {
      ReadyCount += 1;
    }
    if (interaction.customId === "0") {
      NotReadyCount += 1;
    }
    interaction.reply({
      content: "Voted (Please don't vote again)",
      ephemeral: true,
    });
    await wait(5000);
    await interaction.deleteReply();
  }
});

client.login(process.env.TOKEN);
