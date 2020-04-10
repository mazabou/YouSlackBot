/**
 * Adds a date and time stamp to console log -usage: debug.log()
 * @type {{log}}
 */
exports.debug = (function(){

    const timestamp = () => {};
    timestamp.toString = () => `\n[${(new Date).toLocaleDateString()} ${(new Date).toLocaleTimeString()}]`;
    return {
        log: console.log.bind(console, '%s', timestamp)
    }

})(); //eof debug

