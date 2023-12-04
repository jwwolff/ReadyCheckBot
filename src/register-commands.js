require('dotenv').config();
const{REST,Routes} = require('discord.js');

const commands = [
    {
        name: 'ready-check',
        description: 'Initiates a ready check for everyone in a voice channel',
    },
    {
        name: 'readycheck',
        description: 'Initiates a ready check for everyone in a voice channel',
    },
    {
        name: 'rcheck',
        description: 'Initiates a ready check for everyone in a voice channel',
    },
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try{
        console.log('Registering Commands...');
/*
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands}
        );
*/
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID),
            {body: commands}
        );


        console.log('Commands Registered');
        
    }catch(error){
        console.log(`Error: ${error}`);
    }
})();