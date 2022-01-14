/**
 * Prints the command to connect to host.
 * @requires /iBreakEverything/util/ServerMapper.js
 * @alias path='run /iBreakEverything/util/ServerMapper.js; run /iBreakEverything/util/PathToServer.js'
 * @usage path <hostname>
 * @remarks RAM cost: 1.60 GB
 * @param {import('..').NS} ns
 * @arg {String} hostname Traget to get path to
 */
export async function main(ns) {
    const home = 'home';
    const hostname = ns.args[0];
    if (!hostname) {
        ns.tprint('INFO: Usage: path <hostname>');
        return;
    }
    if (hostname == home) {
        ns.tprint('INFO: Access home using:\nhome');
        return;
    } else {
        const rawServerData = await ns.read('/iBreakEverything/data/servers.txt');
        const serversList = JSON.parse(rawServerData);
        let result = serversList.find((elem) => {
            if (elem.hostname == hostname) {
                ns.tprint(`INFO: Access '${hostname}' using:\n${[...elem.pathFromHome, hostname].join('; connect ')}`);
                return true;
            }
            return false;
        });
        if (!result) {
            ns.tprint(`WARN: Can't resolve hostname '${hostname}'.`);
        }
    }
}