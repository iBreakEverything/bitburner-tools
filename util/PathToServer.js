import { printPath } from '/scripts/lib/StandaloneTools.js';


/**
 * Prints the command to connect to host.
 * ServerMapper.js must be run first.
 * alias path="run <path_to_script>/PathToServer.js"
 * Usage: path <hostname>
 * @remarks RAM cost: 1.60 GB
 * @param {NS} ns
 * @arg {String} hostname Traget to get path to
 */
export async function main(ns) {
	const home = "home";
	const hostname = ns.args[0];
	if (!hostname) {
		ns.tprint("ERROR: Hostname can't be empty.");
		return;
	}
	if (hostname == home) {
		printPath(ns, home, home);
		return;
	} else {
		const rawData = await ns.read("/scripts/data/servers.txt");
		const hostsList = JSON.parse(rawData);
		let result = hostsList.find((elem) => {
			if (elem.hostname == hostname) {
				printPath(ns, hostname, [...elem.pathFromHome, hostname].join("; connect "));
				return true;
			}
			return false;
		});
		if (!result) {
			ns.tprint("WARN: Can't resolve hostname '", hostname, "'.");
		}
	}
}