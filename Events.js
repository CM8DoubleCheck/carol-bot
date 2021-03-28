const { EventEmitter } = require("events");
const commands = new EventEmitter;
module.exports = class extends EventEmitter {
    constructor() {
        super();
        this.commands = commands;
    }
}
