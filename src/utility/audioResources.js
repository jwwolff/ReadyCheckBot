const { createAudioResource } = require("@discordjs/voice");
const { join } = require("node:path");

console.log("[audio] Loading audio resources...");

const resourcePaths = {
    StartReadyCheck: join(__dirname, "../assets/Ready_Check.opus"),
    ReadyCheckPassed: join(__dirname, "../assets/All_Ready.opus"),
    ReadyCheckFailed: join(__dirname, "../assets/Not_Ready.opus"),
};

Object.keys(resourcePaths).forEach(key => {
  console.log("[audio]   " + key + ": " + resourcePaths[key]);
});

const StartReadyCheck = () => createAudioResource(resourcePaths.StartReadyCheck);
const ReadyCheckPassed = () => createAudioResource(resourcePaths.ReadyCheckPassed);
const ReadyCheckFailed = () => createAudioResource(resourcePaths.ReadyCheckFailed);

module.exports = {
    StartReadyCheck,
    ReadyCheckPassed,
    ReadyCheckFailed
};
