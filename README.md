# ReadyCheckBot
Discord bot that can initiate a ready check for those in the voice channel of the person that initiated it

Inspired by FFXIV ready check.
Does not include audio files:
- All_Ready.mp3
- Not_Ready.mp3
- Ready_Check.mp3
These audio files will need to be supplied in ./src/assets

Currently does not have detection for multiple votes per person handling

It also assumes that the person initiating the ready check is ready.

To use create a .env file with:
- TOKEN = Discord Bot Token
- CLIENT_ID = Discord bot ID
- GUILD_ID = Discord server ID (for the 'applicationGuildCommands')

Then run the register-commands.js file followed by 'node src/index'