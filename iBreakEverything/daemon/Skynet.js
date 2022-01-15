import { countCrackingTools, runScriptWaitTermination } from '/iBreakEverything/lib/NsTools.js';
import { listFarmableServers, nextHackableServer } from '/iBreakEverything/lib/ServerObjectTools.js';

/**
 * Hacks the world.
 * @remarks RAM cost: 3.95 GB
 * @param {import('..').NS} ns
 */
export async function main(ns) {
    ns.disableLog('ALL');

    const home = 'home';
    const _hack = '/iBreakEverything/util/Hack.js';
    const mapper = '/iBreakEverything/util/ServerMapper.js';
    const rootkit = '/iBreakEverything/util/Rootkit.js';
    const rce = '/iBreakEverything/util/RCE.js';
    const rootedServersFile = '/iBreakEverything/data/rooted.txt';
    let surveillanceMode = false;

    ns.print(`INFO: {${new Date().toISOString()}} Initialized.`);

    while (true) {
        ns.print(`INFO: {${new Date().toISOString()}} Runnnign mapper.`);
        await runScriptWaitTermination(ns, mapper);

        let rawServersData = await ns.read('/iBreakEverything/data/servers.txt');

        ns.print(`INFO: {${new Date().toISOString()}} Runnnign rootkit.`);
        await runScriptWaitTermination(ns, rootkit, [rawServersData]);

        if (ns.fileExists(rootedServersFile, home)) {
            ns.print(`INFO: {${new Date().toISOString()}} File ${rootedServersFile} exists.\nRunning mapper to update servers file.`);
            await runScriptWaitTermination(ns, mapper);
            rawServersData = await ns.read('/iBreakEverything/data/servers.txt');
            ns.rm(rootedServersFile, home);
        }

        let servers = await listFarmableServers(rawServersData, ns.getScriptRam(_hack));
        if (servers.length > 0) {
            ns.print(`INFO: {${new Date().toISOString()}} New farmable servers:\n${servers}`);
            for(let server of servers) {
                ns.print(`INFO: {${new Date().toISOString()}} Running rce on ${server}`);
                await runScriptWaitTermination(ns, rce, [server, _hack]);
            }
        }

        let tools = countCrackingTools(ns);
        let next = await nextHackableServer(rawServersData, tools);
        if (Number.MAX_SAFE_INTEGER == next) {
            if (tools < 5) {
                ns.print(`WARN: {${new Date().toISOString()}} Not enough tools to crack more servers. Buy some more.`);
                ns.toast('[SKYNET] Buy more tools, slave.', 'warning', 1 * 60 * 1000);
            } else {
                ns.print(`WARN: {${new Date().toISOString()}} No more servers to crack.\nSkynet is now in surveillance mode and will check on scripts and restarts them in case of crash.`);
                surveillanceMode = true;
                ns.toast('[SKYNET] I am watching you.', 'success', 30 * 1000);
            }
        } else {
            ns.print(`INFO: {${new Date().toISOString()}} Next server can be cracked at hacking level ${next}.`);
            ns.toast(`[SKYNET] Next NUKE at ${next} hacking.`, 'info', 1 * 60 * 1000);
        }
        while (next > ns.getHackingLevel()) {
            if (!surveillanceMode) {
                next = await nextHackableServer(rawServersData, tools);
                await ns.sleep(60 * 1000);
            } else {
                await ns.sleep(5 * 60 * 1000);
            }
        }
        await ns.sleep(250);
    }
}