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
const { changeStatus, addMemberToState } = require("./utility/readyCheckState");
const { 
  StartReadyCheck,
  ReadyCheckPassed,
  ReadyCheckFailed
 } = require("./utility/audioResources");

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

var rCheckState = [];
var waitTime = 30;

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

  var invokingMember = interaction.member;
  if (!invokingMember || !invokingMember.user) return;

  var invokingUser = {
    id: invokingMember.user.id,
    username: invokingMember.user.username,
    guildNickname: invokingMember.nickname ?? '',
    globalName: invokingMember.user.globalName ?? '',
  }

  var optionUsers = getOptionUsers(interaction);
  var voiceChannel = await interaction.member?.voice?.channel;

  if (optionUsers.length > 0) {
    addMemberToState(rCheckState, invokingUser.id, invokingUser.username, true);
    optionUsers.forEach((user) => {
      addMemberToState(rCheckState, user.id, user.username);
    });
  } else if (voiceChannel){
    voiceChannel.members.forEach(member => {
      addMemberToState(rCheckState, member.id, member.user.username);
    });
    changeStatus(rCheckState, interaction.member.id, true);
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
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });
  
  connection.subscribe(player);
  player.play(StartReadyCheck());

  //TODO: fix this stupid wait statement

  while (waitTime != 0) {
    await wait(1000);
    if (NotReadyCount + ReadyCount >= memberCount) {
      waitTime = 0;
    } else {
      waitTime -= 1;
      await interaction.editReply({
        components: [row],
      });
    }
  }

  if (ReadyCount == memberCount) {
    await interaction.editReply({
      content: "Ready Check: **PASSED**",
      components: [],
    });

    player.play(ReadyCheckPassed());
  } else {
    await interaction.editReply({
      content: `Ready Check: **FAILED** (${NotReadyCount})`,
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
      if (rCheckState[interaction.member.id] === true) {
        interaction.reply({
          content: "You've already voted",
          ephemeral: true,
        });
        await wait(5000);
        await interaction.deleteReply();
        return;
      }
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
        ephemeral: true,
      });

      while (rCheckState[interaction.member.id] === false) {
        await wait(1);
      }
      await interaction.deleteReply();
    }
  }


  //Handle Voting
  if (interaction.isButton()) {

    if (interaction.customId === "3") return;
    if (rCheckState[interaction.member.id] === true) {
      interaction.reply({
        content: "You've already voted",
        ephemeral: true,
      });
      await wait(5000);
      await interaction.deleteReply();
      return;
    }
    if (interaction.customId === "1") {
      ReadyCount += 1;
      rCheckState[interaction.member.id] = true
    }
    if (interaction.customId === "0") {
      NotReadyCount += 1;
      rCheckState[interaction.member.id] = true
    }

    await interaction.reply({
      content: "Voted",
      ephemeral: true,
    });


    await wait(5000);
    await interaction.deleteReply();
  }
}

module.exports = {
  handleInteractions
};