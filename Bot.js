const Discord = require("discord.js");
const Events = require("./Events");
const Logger = require("./Logger");

module.exports = class {
    logger;
    events;
    client;
    Embed;
    constructor(token) {
        this.logger = new Logger();
        this.events = new Events();
        this.client = new Discord.Client();
        this.Embed = Discord.MessageEmbed;

        this.login(token);
        this.client.ws.on("INTERACTION_CREATE", async interaction => this.commandEvent(interaction)); // listen for slash commands
    }

    login = (token) => {
        this.client.login(token).then(r => {
            this.logger.info(`Bot logged in as ${this.client.user.username}#${this.client.user.discriminator}`);
        }).catch(console.error);
    }

    registerCommand = (guildId, name, description, options) => {
        name = name.toLowerCase();
        this.client.api.applications(this.client.user.id).guilds(guildId).commands.post({data: { name, description, options }}).then().catch(console.error);
    }

    commandEvent = (interaction) => {
        if (!this.client) throw new Error("Bot not logged in yet");
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        this.events.commands.emit(command, {
            getArgs: () => { return args },
            reply: async content => {
                this.client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {content}
                    }
                });
            }
        })

    }

}
