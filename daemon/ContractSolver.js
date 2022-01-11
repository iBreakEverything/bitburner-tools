import { solveContract } from '/scripts/lib/Contracts.js';

/** 
 * Contract Solver
 * Finds contracts and solves them.
 * @remarks RAM cost: 21.8 GB
 * @param {NS} ns
 */
export async function main(ns) {
	const rawData = await ns.read("/scripts/data/servers.txt");
	while (true) {
		const hostsList = JSON.parse(rawData);
		const hostnames = hostsList.reduce((acc, elem) => { acc.push(elem.hostname); return acc; }, []);
		hostnames.forEach(host => {
			let contracts = ns.ls(host, "contract");
			for (let contract of contracts) {
				let type = ns.codingcontract.getContractType(contract, host);
				let data = ns.codingcontract.getData(contract, host);
				let solution = solveContract(type, data);
				if (solution === null) {
					ns.tprint(`WARN: [${host}] Contract "${type}" is not implemented.\nData: ${JSON.stringify(data)}\nData type: ${typeof (data)}`);
					continue;
				}
				let response = ns.codingcontract.attempt(solution, contract, host, { returnReward: true });
				if (response) {
					ns.tprint(`INFO: [${host}] Contract "${type}" success.\n${response}.`);
				} else {
					ns.tprint(`ERROR: [${host}] Contract "${type}" failed.\n${solution}.`);
				}
			}
		});
		await ns.sleep(60 * 1000);
	}
}