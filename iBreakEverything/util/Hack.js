/**
 * Basic hack for demo. Replace with your own.
 * @param {import('..').NS} ns
 * @arg0 hostName
 */
export async function main(ns) {
    let hostName = ns.args[0];
    while (true) {
        await ns.weaken(hostName);
        await ns.grow(hostName);
        await ns.hack(hostName);
        await ns.weaken(hostName);
    }
}