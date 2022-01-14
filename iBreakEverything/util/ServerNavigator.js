import { executeTerminalCommand } from '/iBreakEverything/lib/DOMTools.js';
import { pathToServer } from '/iBreakEverything/lib/ServerObjectTools.js';


/**
 * @remarks RAM cost: 1.6 GB
 * @param {import('..').NS} ns
 */
export async function main(ns) {
    /* Log Textbox */
    ns.disableLog('ALL');
    ns.clearLog();
    ns.print('Anchor');  // First message
    ns.tail();
    await ns.sleep(50);  // Wait for log to open
    let scriptName = ns.getScriptName();
    let doc = eval('document');
    let scriptLogTitlebar = Array(...doc.querySelectorAll('h6[title]')).find(x => x.title.includes(scriptName));
    scriptLogTitlebar.innerText = "Server Navigator";
    if (!scriptLogTitlebar) {
        ns.tprint('ERROR: Can\'t find log window.');
        return;
    }
    let scriptLogMessagePool;
    try {
        scriptLogMessagePool = scriptLogTitlebar.parentNode.parentNode.nextSibling.firstChild.firstChild;
    } catch (error) {
        ns.tprint(`ERROR: Failed to access log message box.\n${JSON.stringify(error)}`);
        return;
    }
    if (!scriptLogMessagePool) {
        ns.tprint('ERROR: Can\'t find log message box.');
        return;
    }
    scriptLogMessagePool.parentNode.style.width = '450px';  // FIXME buggy Resize box
    let firstMessage = scriptLogMessagePool.firstChild;
    if (!firstMessage) {
        ns.tprint('ERROR: Can\'t find first log message.');
        return;
    }
    /* Payload */
    const rawServerData = await ns.read('/iBreakEverything/data/servers.txt');
    const serversList = JSON.parse(rawServerData);
    let networkTree = {};
    for (let server of serversList) {
        addServer(networkTree, [...server.pathFromHome, server.hostname]);
    }
    let printMe = ['home'];
    walk(printMe, serversList, networkTree.home, '', Array(...firstMessage.classList).join(' '));
    scriptLogMessagePool.firstChild.style.lineHeight = 1.1;
    scriptLogMessagePool.firstChild.innerHTML = printMe.join('\n');
    // TODO backdoor and rooted
    for (let server of serversList) {
        let element = doc.querySelector(`#connect_${server.hostname.replaceAll('.', 'DOT')}`);
        if (!element) {
            continue;
        }
        let path = await pathToServer(JSON.stringify(serversList), server.hostname);
        element.onclick = function () {
            executeTerminalCommand(path);
        };
    }
}

function addServer(cursor, pathFromHome) {
    if (!cursor[pathFromHome[0]]) {
        cursor[pathFromHome[0]] = {};
    }
    if (pathFromHome.length > 1) {
        addServer(cursor[pathFromHome[0]], pathFromHome.slice(1));
    }
}

function walk(printMe, serversList, tree, prefix, classString) {
    let hostnames = Object.keys(tree);
    if (hostnames.length == 0) {
        return;
    }
    for (let host in hostnames) {
        const parts = host == hostnames.length - 1 ? ['└─', '  '] : ['├─', '│ '];
        
        let payload = `<span class='${classString}' id='connect_${hostnames[host].replaceAll('.', 'DOT')}' style='line-height:1;text-decoration:none;background-color:#00F0C015'>${hostnames[host]}</span>`;//TODO span rooted+backdoor
        printMe.push(`${prefix}${parts[0]}${payload}`);
        walk(printMe, serversList, tree[hostnames[host]], `${prefix}${parts[1]}`, classString);
    }
}