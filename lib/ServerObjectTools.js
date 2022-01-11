/**
 * Tools that manipulate a list of server objects.
 * To get a server object for a hostname run ns.getServer(hostname).
 */


/**
 * Gets the command to connect to a server or null if hostname don't exist.
 * @param {NS} ns
 * @param {String} rawServersData JSONed list of server objects
 * @param {String} hostname
 * @return {String} connect command
 */
export async function pathToServer(ns, rawServersData, hostname="home") {
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
 * @param {NS} ns 
 * @param {String} rawServersData JSONed list of server objects
 */
export async function nextHackableServer(ns, rawServersData, hackingTools) {
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
 * @param {NS} ns
 * @param {String} rawServersData JSONed list of server objects
 * @param {Number} scriptRam Ammount of RAM used by the script
 */
export async function listFarmableServers(ns, rawServersData, scriptRam) {
	const hostsList = JSON.parse(rawServersData);
	let result = hostsList.reduce((acc, elem) => {
		let check = (elem.hasAdminRights					// is admin
			&& elem.moneyMax > 0							// no money no funny
			&& elem.maxRam >= scriptRam						// can be ran
			&& ((elem.maxRam - elem.ramUsed) >= scriptRam	// ram for more
				|| elem.ramUsed == 0));						// ram for days
		if (check) {
			acc.push(elem.hostname);
		}
		return acc;
	}, []);
	return result;
}