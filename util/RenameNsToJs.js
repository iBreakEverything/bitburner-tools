/** 
 * Prints a command to change '.ns' extension to '.js'.
 * @param {NS} ns
 */
export async function main(ns) {
	const host = 'home';
	let nsFiles = ns.ls(host, '.ns');
	if (nsFiles.length == 0) {
		ns.tprint(`INFO: no .ns files found on host '${host}'`);
	}
	let commands = [];
	for (let filename of nsFiles) {
		let command = `mv ${filename} ${filename.slice(0,filename.length-2)}js`;
		commands.push(command);
	}
	ns.tprint(`INFO: To rename all .ns files to .js use the following command:\n${commands.join('; ')}`);
}