const wait = require("node:timers/promises").setTimeout;
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
  NoSubscriberBehavior
} = require("@discordjs/voice");
const { join } = require("node:path");

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
 var MemberCheckState ={};
 var waitTime = 30;

async function handleInteractions(interaction){
    if (interaction.isChatInputCommand()) {
        if (
          interaction.commandName === "ready-check" ||
          interaction.commandName === "readycheck" ||
          interaction.commandName === "rcheck"
        ) {
          ReadyCount = 0;
          NotReadyCount = 0;
          waitTime = 30;
    
          var voiceChannel = await interaction.member?.voice?.channel;
          if (!voiceChannel) return;
          
         
          //console.log(interaction.member.id);
          voiceChannel.members.forEach(member => {
            //console.log(member.id);
            MemberCheckState[member.id] =  false;
          });
          MemberCheckState[interaction.member.id] = true;
    
          //console.log(MemberCheckState[interaction.member.id]);
          var memberCount = voiceChannel.members.size - 1;
          //console.log(voiceChannel.members.size - 1);
    
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
          let StartReadyCheck = createAudioResource(
            join(__dirname, "Ready_Check.mp3")
          );
          connection.subscribe(player);
          player.play(StartReadyCheck);
    
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
    
          await wait(5000);
          if(connection) await connection.destroy();
          await wait(5000);
          await interaction.deleteReply();
        }
      }
      //Handle Voting Buttons
      if (interaction.isButton()) {
        
        if (interaction.customId === "3"){
          if(MemberCheckState[interaction.member.id] === true) {
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
    
          while(MemberCheckState[interaction.member.id] === false){
            await wait(1);
          }
          await interaction.deleteReply();
        }
      }
    
    
      //Handle Voting
      if (interaction.isButton()) {
        
        if (interaction.customId === "3") return;
        if(MemberCheckState[interaction.member.id] === true){
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
          MemberCheckState[interaction.member.id] = true
        }
        if (interaction.customId === "0") {
          NotReadyCount += 1;
          MemberCheckState[interaction.member.id] = true
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