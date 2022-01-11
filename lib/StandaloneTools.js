/**
 * Runs a command in terminal.
 * @param {String} command
 */
export function executeTerminalCommand(command) {
	const doc = eval("document");
	const terminal = doc.querySelector("#terminal-input");
	if (terminal && !terminal.hasAttribute("disabled")) {
		const keys = Reflect.ownKeys(terminal);
		terminal.value = command;
		terminal[keys[1]].onChange({ target: terminal });
		terminal[keys[1]].onKeyDown({ keyCode: 13, preventDefault: () => null });
	}
}

/**
 * Checks if a server can be hacked.
 * @param {{}} serverObject Server object
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

/**
 * Gets the number of the port opening tools.
 * @remarks RAM cost: 0.1 GB
 * @param {NS} ns
 * @return {Number} tool count
 */
export function countCrackingTools(ns) {
	const tools = ["FTPCrack.exe", "BruteSSH.exe", "HTTPWorm.exe", "relaySMTP.exe", "SQLInject.exe"];
	let count = 0;
	for (let tool of tools) {
		if(ns.fileExists(tool, "home")) {
			count++;
		}
	}
	return count;
}

/**
 * Cracks a server, granting root access.
 * @remarks RAM cost: 0.35 GB
 * @param {NS} ns
 * @param {String} hostname Target
 */
export function rootTarget(ns, hostname) {
	const home = "home";
	
	if (ns.fileExists("FTPCrack.exe", home)) {
		ns.ftpcrack(hostname);
	}

	if (ns.fileExists("BruteSSH.exe", home)) {
		ns.brutessh(hostname);
	}

	if (ns.fileExists("HTTPWorm.exe", home)) {
		ns.httpworm(hostname);
	}

	if (ns.fileExists("relaySMTP.exe", home)) {
		ns.relaysmtp(hostname);
	}

	if (ns.fileExists("SQLInject.exe", home)) {
		ns.sqlinject(hostname);
	}

	ns.nuke(hostname);
}

/**
 * Print helper fucntion.
 * @param {NS} ns
 * @param {String} hostname Host to connect to
 * @param {String} path Command that will connect user to host
 */
export function printPath(ns, hostname, path) {
	ns.tprint("INFO: Access '", hostname, "' using:\n" + path);
}

/**
 * Runs and waits for a script to end.
 * @remarks RAM cost: 1.1 GB
 * @param {NS} ns
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
		await ns.sleep(250);
	}
}