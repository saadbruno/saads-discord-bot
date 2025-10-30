// commands/purgeMessages.js
const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require(`discord.js`);
const { deleteDuplicateMessages } = require(`../../modules/messages`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`purge-messages`)
        .setDescription(`Delete all messages from a user that match the same content as a given message ID.`)
        .addStringOption(option =>
            option
                .setName(`message_id`)
                .setDescription(`The ID of the message to match.`)
                .setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const messageId = interaction.options.getString(`message_id`);
        const logNamespace = `:: /purge-messages ::`;
        console.log(`${logNamespace} ▶️ Running with message ID ${messageId}`);

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        // Check permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return interaction.editReply(`❌ You don't have permission to delete messages.`);
        }

        // Try to fetch the message
        let targetMessage = null;

        for (const [, channel] of interaction.guild.channels.cache) {

            if (!channel.isTextBased() || !channel.viewable) continue;
            console.log(`${logNamespace} 🔎 Trying to find message on channel #${channel.name} (${channel.id})`);

            try {
                const msg = await channel.messages.fetch(messageId);
                if (msg) {
                    targetMessage = msg;
                    break;
                }
            }
            catch (e) { e; }
        }

        if (!targetMessage) {
            return interaction.editReply(`⚠️ Could not find a message with that ID in any text channel.`);
        }

        console.log(`${logNamespace} ✅ FOUND! Deleting messages with the same content...`);

        const res = await deleteDuplicateMessages(targetMessage);

        return interaction.editReply(res);
    },
};
