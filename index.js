/*
Main entry point for CarolBot
*/

const config = require("./config.json");
const Bot = require("./Bot");
const bot = new Bot(config.token);

bot.client.on('ready', async e => {
    bot.registerCommand(config.guildId, "ping", "Ping CarolBot!", []);

    bot.client.user.setActivity("for DMs", {type: "WATCHING"}).then(() => {
        bot.logger.info("Set presence");
    }).catch(console.error);

});

bot.events.commands.on("ping", async e => {
    e.reply("Pong!");
});

bot.client.on('message', async message => {
    if (!message.guild && !message.author.bot) { // Direct Message
        let valid = false;
        let type;
        Object.keys(config.dm).forEach((t) => {
            config.dm[t].forEach((regex) => {
                if (new RegExp(regex).test(message)) {
                    valid = true;
                    type = t;
                }
            });
        });
        if (valid && typeof type !== undefined) {
            // Forward the URL into a private channel where only staff can view it.
            type = type.charAt(0).toUpperCase() + type.slice(1);
            const embed = new bot.Embed()
                .setColor("#0099ff")
                .setDescription(message)
                .setTimestamp();
            if (message.author.avatarURL() !== null) {
                embed.setAuthor(type + " from " + message.author.username, message.author.avatarURL());
            } else {
                embed.setAuthor(type + " from " + message.author.username);
            }
            bot.client.channels.cache.get(config["forward-dms-channel"]).send({embed}).then(e => {
                message.channel.send("Thanks! I've forwarded your message onto the staff.");
            }).catch(e => {
                console.error(e);
                message.channel.send("I encountered an error while forwarding your message. Sorry :(");
            });
        } else message.channel.send("Oops! I'm unable to process that message. I currently accept timings reports and pastebin links!");
    }
});
