/**
 * Remote code execution on specified target with maximum threads.
 * @remarks RAM cost: 3.65 GB
 * @param {import('..').NS} ns
 * @param {String} target Server to hack
 * @param {String} scriptHack Script to copy & remote execute on target
 */
export async function main(ns) {
    const home = 'home';
    const target = ns.args[0];
    const scriptHack = ns.args[1];
    const maxThreads = Math.floor(ns.getServerMaxRam(target) / ns.getScriptRam(scriptHack, home));
    if (maxThreads > 0) {
        let scpStatus = await ns.scp(scriptHack, home, target);
        if (scpStatus) {
            ns.exec(scriptHack, target, maxThreads, target);
        } else {
            ns.print(`ERROR: scp failed: ${scpStatus}`)
        }
    } else {
        ns.print(`ERROR: invalid thread count ${maxThreads}`)
    }
}