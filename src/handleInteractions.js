const wait = require("node:timers/promises").setTimeout;
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior
} = require("@discordjs/voice");
const { 
  setReady,
  setNotReady, 
  addMemberToState, 
  isReady, 
  getReadyCount,
  getNotReadyCount} = require("./utility/readyCheckState");
const {
  StartReadyCheck,
  ReadyCheckPassed,
  ReadyCheckFailed
} = require("./utility/audioResources");

const votingButtons = [
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

var rCheckState = [];
var waitTime = 30;
var voiceEnabled = false;

function getOptionUsers(interaction) {
  var optionUsers = [];
  for (let i = 1; i <= 6; i++) {
    var user = interaction.options.getUser(`user${i}`);
    if (user) {
      optionUsers.push(user);
    }
  }
  return optionUsers;
}

async function startReadyCheckSession(interaction) {
  ReadyCount = 0;
  NotReadyCount = 0;
  waitTime = 30;
  rCheckState = [];
  var connection = null;

  var invokingMember = interaction.member;
  if (!invokingMember || !invokingMember.user) return;

  var invokingUser = {
    id: invokingMember.user.id,
    username: invokingMember.user.username,
    guildNickname: invokingMember.nickname ?? '',
    globalName: invokingMember.user.globalName ?? '',
  }

  var optionUsers = getOptionUsers(interaction);
  var invokingMemberVoiceChannel = await interaction.member?.voice?.channel;
  voiceEnabled = invokingMemberVoiceChannel ? true : false;

  if (optionUsers.length > 0) {
    addMemberToState(rCheckState, invokingUser.id, invokingUser.username, true);
    optionUsers.forEach((user) => {
      addMemberToState(rCheckState, user.id, user.username);
    });
  } else if (invokingMemberVoiceChannel) {
    invokingMemberVoiceChannel.members.forEach(member => {
      addMemberToState(rCheckState, member.id, member.user.username);
    });
    setReady(rCheckState, interaction.member.id);
  } else {
    await interaction.reply({
      content: "You must be in a voice channel or target users to use this command",
      ephemeral: true,
    });
    return;
  }

  var memberCount = rCheckState.length;

  const row = new ActionRowBuilder();

  row.components.push(
    new ButtonBuilder()
      .setLabel("Vote")
      .setStyle(ButtonStyle.Success)
      .setCustomId("3")
  );

  await interaction.reply({
    components: [row],
  });

  //VC vode
  if (voiceEnabled) {
    connection = joinVoiceChannel({
      channelId: invokingMemberVoiceChannel.id,
      guildId: invokingMemberVoiceChannel.guild.id,
      adapterCreator: invokingMemberVoiceChannel.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);
    player.play(StartReadyCheck());
  }
  //TODO: fix this stupid wait statement?

  while (waitTime != 0) {
    await wait(1000);
    // if either everyone is ready, or at leas on person is ready, stop the session
    if (getReadyCount(rCheckState) >= memberCount) {
      waitTime = 0;
    } else {
      waitTime -= 1;
      await interaction.editReply({
        components: [row],
      });
    }
  }

  if (getReadyCount(rCheckState) == memberCount) {
    await interaction.editReply({
      content: "Ready Check: **PASSED**",
      components: [],
    });

    player.play(ReadyCheckPassed());
  } else {
    await interaction.editReply({
      content: `Ready Check: **FAILED** (${getNotReadyCount(rCheckState)} not ready)`,
      components: [],
    });

    player.play(ReadyCheckFailed());
  }

  await wait(5000);
  if (connection) await connection.destroy();
  await wait(5000);
  await interaction.deleteReply();
}

async function handleInteractions(interaction) {
  if (interaction.isChatInputCommand()) {
    if (["ready-check", "readycheck", "rcheck"].includes(interaction.commandName)) {
      await startReadyCheckSession(interaction);
    }
  }

  //Handle Voting Buttons
  if (interaction.isButton()) {
    if (interaction.customId === "3") {
      if (isReady(rCheckState, interaction.member.id)) {
        interaction.reply({
          content: "You've already voted",
          ephemeral: true,
        });
        await wait(5000);
        await interaction.deleteReply();
        return;
      }
      const row = new ActionRowBuilder();

      votingButtons.forEach((btn) => {
        row.components.push(
          new ButtonBuilder()
            .setLabel(btn.Label)
            .setStyle(btn.ButtonStyle)
            .setCustomId(btn.id)
        );
      });

      await interaction.reply({
        components: [row],
        ephemeral: true,
      });

      while (!isReady(rCheckState, interaction.member.id)) {
        await wait(1);
      }

      await interaction.deleteReply();
    } else {
      if (rCheckState[interaction.member.id] === true) {
        interaction.reply({
          content: "You've already voted",
          ephemeral: true,
        });
        await wait(5000);
        await interaction.deleteReply();
        return;
      }
      
      if (interaction.customId === "1")
        setReady(rCheckState, interaction.member.id);
      if (interaction.customId === "0")
        setNotReady(rCheckState, interaction.member.id);
  
      await interaction.reply({
        content: "Voted",
        ephemeral: true,
      });
  
  
      await wait(5000);
      await interaction.deleteReply();
    }
  }
}

module.exports = {
  handleInteractions
};