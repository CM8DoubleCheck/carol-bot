module.exports = class {
    info = (msg) => {
        const time = Date.now().toString();
        console.log(`[${time}][INFO] ${msg}`);
    }
    warn = (msg) => {
        const time = Date.now().toString();
        console.warn(`${time}[WARN] ${msg}`);
    }
    error = (msg) => {
        const time = Date.now().toString();
        console.error(`${time}[ERROR] ${msg}`);
    }
}
