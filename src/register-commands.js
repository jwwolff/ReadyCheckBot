require('dotenv').config();
const{REST,Routes, ApplicationCommandOptionType} = require('discord.js');

const options = [
    {
        name: 'user1',
        description: 'First User',
        type: ApplicationCommandOptionType.User,
        required: false,
        autocomplete: true
    },
    {
        name: 'user2',
        description: 'Second User',
        type: ApplicationCommandOptionType.User,
        required: false,
        autocomplete: true
    },
    {
        name: 'user3',
        description: 'Third User',
        type: ApplicationCommandOptionType.User,
        required: false,
        autocomplete: true
    },
    {
        name: 'user4',
        description: 'Fourth User',
        type: ApplicationCommandOptionType.User,
        required: false,
        autocomplete: true
    },
    {
        name: 'user5',
        description: 'Fifth User',
        type: ApplicationCommandOptionType.User,
        required: false,
        autocomplete: true
    },
    {
        name: 'user6',
        description: 'Sixth User',
        type: ApplicationCommandOptionType.User,
        required: false,
        autocomplete: true
    }
];

const commands = [
    {
        name: 'ready-check',
        description: 'Initiates a ready check for everyone in a voice channel',
        options
    },
    {
        name: 'readycheck',
        description: 'Initiates a ready check for everyone in a voice channel',
        options
    },
    {
        name: 'rcheck',
        description: 'Initiates a ready check for everyone in a voice channel. Can tag up to 6 users in addition to the caller',
        options
    }
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