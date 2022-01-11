import { pathToServer } from '/scripts/lib/ServerObjectTools.js';
import { executeTerminalCommand } from '/scripts/lib/StandaloneTools.js';

/** 
 * Contract Finder
 * Finds contracts and displays them in the player stats gui.
 * @remarks RAM cost: 1.95 GB
 * @param {NS} ns
 */
export async function main(ns) {
	const rawServersData = await ns.read("/scripts/data/servers.txt");
	const serversList = JSON.parse(rawServersData);
	const hosts = serversList.reduce((acc, elem) => { acc.push(elem.hostname); return acc; }, []);
	const doc = eval("document");
	// Stats Table
	const anchor = doc.querySelector(".MuiTableBody-root");
	initUI(doc, anchor);

	while (true) {
		// Clear UI
		clearContracts(doc);
		// Check every server for contracts
		for (let host of hosts) {
			let contracts = ns.ls(host, "contract");
			if (contracts.length > 0) {
				await addContractHTMLNode(ns, rawServersData, doc, anchor, host, contracts);
			}
		}
		await ns.sleep(3 * 60 * 1000);
	}
}

/**
 * Adds a contract notifier to the status UI.
 * @param {NS} ns
 * @param {String} rawServersData JSONed list of server objects
 * @param {Document} doc		DOM tree
 * @param {Element} anchor		HTML element where all the new elements will be added as children
 * @param {String} host			Hostname of the machine where a contract was found.
 * @param {[String]} contracts	Array of contract filenames.
 */
async function addContractHTMLNode(ns, rawServersData, doc, anchor, host, contracts) {
	// Deep copy HP node
	const trElement = doc.querySelector("#overview-hp-hook").parentNode.parentNode.cloneNode(true);
	trElement.classList.add("contract-remove");
	trElement.children[2].remove();
	trElement.id = "contract" + host.replaceAll(".", "DOT");
	// Hostname & number of contracts
	trElement.children[0].firstElementChild.innerText = host + " - " + contracts.length;
	let path = await pathToServer(ns, rawServersData, host);
	trElement.children[0].firstElementChild.onclick = function () {
		executeTerminalCommand(path);
	};
	// Button to delete notification
	const deleteButton = doc.createElement("button");
	deleteButton.innerText = "❌";
	deleteButton.classList = anchor.querySelector("button").classList;
	deleteButton.onclick = function () { doc.querySelector("#" + trElement.id).remove() };
	// Add button
	trElement.children[1].firstElementChild.innerHTML = "";
	trElement.children[1].firstElementChild.appendChild(deleteButton);
	// Add Node
	anchor.appendChild(trElement);

	/**
	 * 
	 */
}

/**
 * Removes all contract notifiers.
 * @param {Document} doc	DOM tree
 */
function clearContracts(doc) {
	let elements = doc.querySelectorAll(".contract-remove");
	for (let elem of elements) {
		elem.remove();
	}
}

/**
 * Initialize UI by creating a table row element in the status ui.
 * @param {Document} doc	DOM tree
 * @param {Element} anchor	HTML element used to store new contracts as child elements
 */
function initUI(doc, anchor) {
	const id = "contract-anchor";
	// Check if initialized
	if (doc.getElementById(id)) {
		return;
	}
	// Table Row
	const trElement = doc.createElement("tr");
	trElement.classList = anchor.firstElementChild.classList;
	trElement.id = (id);
	const cssClass = [...doc.querySelector("#overview-hp-hook").classList].find(e => e.startsWith("css"));
	trElement.innerHTML = `<td class="${cssClass}"><strong>Contracts</strong></td>`;
	trElement.onclick = function () { doc.querySelector("#" + trElement.id).remove() };
	anchor.appendChild(trElement);
}