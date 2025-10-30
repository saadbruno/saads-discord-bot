const { PermissionsBitField } = require(`discord.js`);

async function kickMessageAuthor(message) {
    const logNamespace = `:: kickMessageAuthor() ::`;

    if (!message.guild) return; // can't kick from DMs

    // Make sure we have a GuildMember object
    const member = message.member;
    if (!member) {
        console.log(`${logNamespace} ⚠️ No member object for the message author (possibly missing GUILD_MEMBERS intent).`);
        return;
    }

    // Safety checks
    // 1) bot has permission to kick members
    const botMember = message.guild.members.me; // the bot's GuildMember
    if (!botMember.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        console.log(`${logNamespace} ⚠️ Bot lacks KICK_MEMBERS permission.`);
        return;
    }

    // 2) Can't kick the guild owner
    if (member.id === message.guild.ownerId) {
        console.log(`${logNamespace} ⚠️ Cannot kick the server owner.`);
        return;
    }

    // 3) Check role hierarchy: bot must be higher than the target
    if (!member.kickable) {
        console.log(`${logNamespace} ⚠️ Member ${member.user.tag} is not kickable (role hierarchy or missing permissions).`);
        return;
    }

    // Optional: don't kick admins / moderators — you can add checks here if desired
    if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    // Build a reason (include some context)
    const reason = `Kicked for message: "${message.content?.slice(0, 100) || `<no content>`}"`;

    try {
        await member.kick(reason);
        console.log(`${logNamespace} ✅ Kicked ${member.user.tag} (${member.id}). Reason: ${reason}`);
        // Optionally notify the channel:
        // await message.channel.send(`Kicked ${member.user.tag}.`);
    }
    catch (error) {
        console.error(`❌ Failed to kick member:`, error);
    }

}

module.exports = { kickMessageAuthor };