import { runScriptWaitTermination, countCrackingTools } from '/scripts/lib/StandaloneTools.js';
import { nextHackableServer, listFarmableServers } from '/scripts/lib/ServerObjectTools.js';

/**
 * Hacks the world.
 * @remarks RAM cost: 3.95 GB
 * @param {NS} ns
 */
export async function main(ns) {
	const home = "home";
	const _hack = "/scripts/util/Hack.js";
	const mapper = "/scripts/util/ServerMapper.js";
	const rootkit = "/scripts/util/Rootkit.js";
	const rce = "/scripts/util/RCE.js";
	const rootedServers = "/scripts/data/rooted.txt";

	ns.print('INFO: init');

	while (true) {
		ns.print('INFO: runnnign mapper');
		await runScriptWaitTermination(ns, mapper);

		let rawServersData = await ns.read("/scripts/data/servers.txt");

		ns.print('INFO: runnnign rootkit');
		await runScriptWaitTermination(ns, rootkit, [rawServersData]);

		if (ns.fileExists(rootedServers, home)) {
			ns.print('INFO: rootedServers exists, running mapper');
			await runScriptWaitTermination(ns, mapper);
			rawServersData = await ns.read("/scripts/data/servers.txt");
			ns.rm(rootedServers, home);
		}

		let servers = await listFarmableServers(ns, rawServersData, ns.getScriptRam(_hack));
		if (servers.length > 0) {
			for(let server of servers) {
				ns.print(`INFO: running rce on ${server}`);
				await runScriptWaitTermination(ns, rce, [server, _hack]);
			}		}

		let next = await nextHackableServer(ns, rawServersData, countCrackingTools(ns));
		ns.print(`INFO: next server ${next}`);
		while (next > ns.getHackingLevel()) {
			await ns.sleep(60 * 1000);
		}
		await ns.sleep(250);
	}
}