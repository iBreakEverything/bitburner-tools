/**
 * Tools that manipulate a list of server objects.
 * Some functions require the extended server object list that can be
 * aquired by running /util/ServerMapper.js and reading the created file.
 * To get a server object for a hostname run ns.getServer(hostname).
 */


/**
 * Gets the command to connect to a server or null if hostname don't exist.
 * @param {String} rawServersData JSONed list of extended server objects
 * @param {String} hostname
 * @return {String} connect command
 */
export async function pathToServer(rawServersData, hostname="home") {
    const hostsList = JSON.parse(rawServersData);
    let server = hostsList.find((elem) => {
        if (elem.hostname == hostname) {
            return true;
        }
        return false;
    });
    return server ? [...server.pathFromHome, hostname].join("; connect ") : null;
}

/**
 * Returns the next unrooted server with the lowest hacking skill requirement.
 * @param {String} rawServersData JSONed list of server objects
 * @param {Number} hackingTools number of port opening tools
 */
export async function nextHackableServer(rawServersData, hackingTools) {
    const hostsList = JSON.parse(rawServersData);
    let result = hostsList.reduce((prev, curr) => {
        if (!curr.hasAdminRights
            && curr.hostname != 'darkweb'
            && curr.numOpenPortsRequired <= hackingTools
            && curr.requiredHackingSkill < prev) {
            prev = curr.requiredHackingSkill;
        }
        return prev;
    }, Number.MAX_SAFE_INTEGER);
    return result;
}

/**
 * Returns a list of farmable servers.
 * @param {String} rawServersData JSONed list of server objects
 * @param {Number} scriptRam Ammount of RAM used by the script
 */
export async function listFarmableServers(rawServersData, scriptRam) {
    const hostsList = JSON.parse(rawServersData);
    let result = hostsList.reduce((acc, elem) => {
        let check = (elem.hasAdminRights                  // is admin
            && elem.moneyMax > 0                          // no money no funny
            && elem.maxRam >= scriptRam                   // can be ran at least once
            && ((elem.maxRam - elem.ramUsed) >= scriptRam // ram is available
                || elem.ramUsed == 0));                   // OR no ram used
        if (check) {
            acc.push(elem.hostname);
        }
        return acc;
    }, []);
    return result;
}

/**
 * Checks if a server can be hacked.
 * @param {{}} serverObject Server object
 * @param {Object} data Object
 * @param {Number} data._hackingSkill Player hacking skill
 * @param {Number} data.crackingToolsCount Number of port opening tools
 * @return {Boolean} Hacking possibility
 */
 export function isHackable(serverObject, data) {
    // Don't hack home
    if (serverObject.hostname == "home") {
        return false;
    }
    // Already have root access.
    if (serverObject.hasAdminRights) {
        return false;
    }
    // Don't have skill to hack.
    if (data._hackingSkill < serverObject.requiredHackingSkill) {
        return false;
    }
    // Can't open enough ports.
    if (data.crackingToolsCount < serverObject.numOpenPortsRequired) {
        return false;
    }
    return true;
}