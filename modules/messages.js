async function deleteDuplicateMessages(targetMessage) {
    const logNamespace = `:: deleteDuplicateMessages() ::`;

    const authorId = targetMessage.author.id;
    const contentToMatch = targetMessage.content;

    if (!contentToMatch) {
        return `⚠️ That message has no text content to match.`;
    }

    let deletedCount = 0;

    // Loop through all text channels and delete matching messages
    for (const [, channel] of targetMessage.guild.channels.cache) {
        if (!channel.isTextBased() || !channel.viewable) continue;
        console.log(`${logNamespace} 🔎 Looking for similar messages on channel #${channel.name} (${channel.id})`);
        try {
            const messages = await channel.messages.fetch({ limit: 100 });
            const toDelete = messages.filter(
                m => m.author.id === authorId && m.content === contentToMatch,
            );

            for (const [, msg] of toDelete) {
                console.log(`${logNamespace} 🗑️ Deleting message ${msg.id}`);
                await msg.delete().catch((e) => { e; });
                deletedCount++;
            }
        }
        catch (e) { e; }
    }

    console.log(`${logNamespace} ✅ Deleted **${deletedCount}** messages from <@${authorId}> that matched the content.`);
    return `✅ Deleted ${deletedCount} messages from <@${authorId}> that matched the content.`;

}

module.exports = { deleteDuplicateMessages };