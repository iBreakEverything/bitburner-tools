/** 
 * Function that finds every connected server and saves information for further use.
 * @remarks RAM cost: 3.8 GB
 * @param {NS} ns
 */
export async function main(ns) {
	const preamble = "export const HOSTS_LIST = ";
	let _scanData = [];
	serverMapper(ns, "home", [], _scanData);
	// For users
	await ns.write("/scripts/data/servers.js", preamble + JSON.stringify(_scanData, null, 2) + ";\n", "w");
	// For scripts
	await ns.write("/scripts/data/servers.txt", JSON.stringify(_scanData, null, 2), "w");
}

/**
 * Depth-first search for server scanning.
 * @param {NS} ns
 * @param {String} hostname Hostname of server to scan.
 * @param {Array} pathFromHome Servers between host and home.
 * @param {Array} _scanData Array containing server objects.
 */
function serverMapper(ns, hostname, pathFromHome, _scanData) {
	// Get data
	let serverObject = ns.getServer(hostname);
	serverObject.pathFromHome = pathFromHome;
	_scanData.push(serverObject);
	// Expand
	const parent = pathFromHome.length ? pathFromHome[pathFromHome.length - 1] : "home";
	let hostsConnected = ns.scan(hostname);
	for (let host of hostsConnected) {
		if (host == parent) {
			continue;
		}
		serverMapper(ns, host, [...pathFromHome, hostname], _scanData);
	}
}