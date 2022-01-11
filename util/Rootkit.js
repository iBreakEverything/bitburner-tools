import { countCrackingTools, isHackable, rootTarget } from '/scripts/lib/StandaloneTools.js';


/**
 * Grants administrator access on all available servers.
 * @remarks RAM cost: 2.05 GB
 * @param {NS} ns
 * @arg {String} rawServersData JSONed list of server objects
 */
export async function main(ns) {
	const hostsList = JSON.parse(ns.args[0]);
	let data = {};
	data._hackingSkill = ns.getHackingLevel();
	data.crackingToolsCount = countCrackingTools(ns);
	const _hackableServers = hostsList.filter(serverObject => isHackable(serverObject, data));
	_hackableServers.map(server => rootTarget(ns, server.hostname));
	if (_hackableServers.length > 0) {
		await ns.write("/scripts/data/rooted.txt", _hackableServers.length, "w");
	}
}