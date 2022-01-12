import { solveContract } from '/iBreakEverything/lib/Contracts.js';

/** 
 * Contract Solver
 * Finds contracts and solves them.
 * @remarks RAM cost: 21.8 GB
 * @param {import('..').NS} ns
 */
export async function main(ns) {
    ns.disableLog("ALL");
    const rawData = await ns.read('/iBreakEverything/data/servers.txt');
    while (true) {
        const hostsList = JSON.parse(rawData);
        const hostnames = hostsList.reduce((acc, elem) => { acc.push(elem.hostname); return acc; }, []);
        hostnames.forEach(host => {
            let contracts = ns.ls(host, 'contract');
            for (let contract of contracts) {
                let type = ns.codingcontract.getContractType(contract, host);
                let data = ns.codingcontract.getData(contract, host);
                let solution = solveContract(type, data);
                if (solution === null) {
                    ns.print(`WARN: [${host}] Contract '${type}' is not implemented.\nData: ${JSON.stringify(data)}\nData type: ${typeof (data)}`);
                    ns.toast('[ContactSolver] Solver not implemented.', 'warning', 60 * 1000);
                    continue;
                }
                let response = ns.codingcontract.attempt(solution, contract, host, { returnReward: true });
                if (response) {
                    ns.print(`INFO: [${host}] Contract '${type}' success.\n${response}.`);
                    ns.toast('[ContactSolver] Contract completed.', 'success', 30 * 1000);
                } else {
                    ns.print(`ERROR: [${host}] Contract '${type}' failed.\n${solution}.`);
                    ns.toast('[ContactSolver] Invalid solution.', 'error', 2 * 60 * 1000);
                }
            }
        });
        await ns.sleep(60 * 1000);
    }
}