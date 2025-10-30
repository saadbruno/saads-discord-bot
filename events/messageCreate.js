const { Events } = require(`discord.js`);
const { deleteDuplicateMessages } = require(`../modules/messages`);
const trapChannelIds = process.env.SPAM_TRAP_CHANNEL_IDS.split(`,`);
const logNamespace = `:: messageCreate ::`;

module.exports = {
    name: Events.MessageCreate,
    execute(message) {

        // don't read message from bots
        if (message.author.bot) return;

        // console.log(`:: ${message.author.tag} enviou uma mensagem em #${message.channel.name} (${message.channel.id}): ${message.content}`);

        // Spam trap. If someone sends a message in one of these channels, we delete all messages with the same content, and kick the user from the server
        if (trapChannelIds.includes(message.channel.id)) {
            console.log(`${logNamespace} 🛑 ${message.author.tag} activated a trap on channel #${message.channel.name}`);
            deleteDuplicateMessages(message);
        }

    },
};