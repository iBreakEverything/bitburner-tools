/**
 * Tools that use the ns parameter.
 * Ordered by RAM cost.
 */


/**
 * Gets the number of the port opening tools.
 * @remarks RAM cost: 0.1 GB
 * @param {import('..').NS} ns
 * @return {Number} tool count
 */
 export function countCrackingTools(ns) {
    const tools = ['FTPCrack.exe', 'BruteSSH.exe', 'HTTPWorm.exe', 'relaySMTP.exe', 'SQLInject.exe'];
    let count = 0;
    for (let tool of tools) {
        if(ns.fileExists(tool, 'home')) {
            count++;
        }
    }
    return count;
}

/**
 * Cracks a server, granting root access.
 * @remarks RAM cost: 0.35 GB
  * @param {import('..').NS} ns
 * @param {String} hostname Target
 */
export function rootTarget(ns, hostname) {
    const home = 'home';
    
    if (ns.fileExists('FTPCrack.exe', home)) {
        ns.ftpcrack(hostname);
    }

    if (ns.fileExists('BruteSSH.exe', home)) {
        ns.brutessh(hostname);
    }

    if (ns.fileExists('HTTPWorm.exe', home)) {
        ns.httpworm(hostname);
    }

    if (ns.fileExists('relaySMTP.exe', home)) {
        ns.relaysmtp(hostname);
    }

    if (ns.fileExists('SQLInject.exe', home)) {
        ns.sqlinject(hostname);
    }

    ns.nuke(hostname);
}

/**
 * Runs and waits for a script to end.
 * @remarks RAM cost: 1.1 GB
  * @param {import('..').NS} ns
 * @param {String} script Script to run
 * @param {Array} args Script arguments. Default null
 */
export async function runScriptWaitTermination(ns, script, args=null) {

    let pid;
    if (args) {
        pid = ns.run(script, 1, ...args);
    } else {
        pid = ns.run(script, 1);
    }
    while (ns.isRunning(pid)) {
        await ns.sleep(200);
    }
}