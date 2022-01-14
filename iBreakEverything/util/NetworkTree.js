/**
 * Prints the network tree with home as root.
 * @requires /iBreakEverything/util/ServerMapper.js
 * @alias networkTree='run /iBreakEverything/util/ServerMapper.js; run /iBreakEverything/util/NetworkTree.js'
 * @usage networkTree
 * @param {import('..').NS} ns
 */
export async function main(ns) {
    const FORMAT_COMAND = true;
    const LINE_HEIGHT = 1.1;

    const rawServerData = await ns.read('/iBreakEverything/data/servers.txt');
    const serversList = JSON.parse(rawServerData);
    let networkTree = {};
    for (let server of serversList) {
        addServer(networkTree, [...server.pathFromHome, server.hostname]);
    }
    let printMe = [];
    walk(printMe, serversList, networkTree, '');
    ns.tprint(printMe.join('\n'));
    if (FORMAT_COMAND) {
        await ns.sleep(50);
        formatCommand(LINE_HEIGHT);
    }
}

/**
 * Creates network tree structure.
 * @param {{}} cursor cursor in tree object
 * @param {Array<String>} pathFromHome array with hostnames
 */
function addServer(cursor, pathFromHome) {
    if (!cursor[pathFromHome[0]]) {
        cursor[pathFromHome[0]] = {}
    }
    if (pathFromHome.length > 1) {
        addServer(cursor[pathFromHome[0]], pathFromHome.slice(1))
    }
}

function walk(printMe, serversList, tree, prefix) {
    let hostnames = Object.keys(tree);
    let serverObjects = serversList.filter(x => hostnames.includes(x.hostname));
    if (hostnames.length == 0) {
        return;
    }
    for (let host in hostnames) {
        const parts = host == hostnames.length - 1 ? ['└── ', '    '] : ['├── ', '│   '];
        printMe.push(`${prefix}${parts[0]}${hostnames[host]}`);
        walk(printMe, serversList, tree[hostnames[host]], `${prefix}${parts[1]}`);
    }
    //document.querySelector(`#connect_${_host}`).click(function(){ MyFunction(); return false; });
}

/**
 * Formats the tree command to be more compact.
 */
 function formatCommand(lineHeight) {
    let doc = eval("document");
    doc.querySelector('#terminal').lastChild.firstChild.style.lineHeight = lineHeight;
}