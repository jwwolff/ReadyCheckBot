const { createAudioResource } = require("@discordjs/voice");
const { join } = require("node:path");

const StartReadyCheck = () => createAudioResource(
    join(__dirname, "../assets/Ready_Check.mp3")
);

const ReadyCheckPassed = () => createAudioResource(
    join(__dirname, "../assets/All_Ready.mp3")
);

const ReadyCheckFailed = () => createAudioResource(
    join(__dirname, "../assets/Not_Ready.mp3")
);

module.exports = {
    StartReadyCheck,
    ReadyCheckPassed,
    ReadyCheckFailed
};