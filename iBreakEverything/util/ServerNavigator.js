import { executeTerminalCommand } from '/iBreakEverything/lib/DOMTools.js';
import { pathToServer } from '/iBreakEverything/lib/ServerObjectTools.js';


/**
 * @requires /iBreakEverything/util/ServerMapper.js
 * @requires /iBreakEverything/lib/DOMTools.js
 * @requires /iBreakEverything/lib/ServerObjectTools.js
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
    scriptLogMessagePool.parentNode.style.width = '480px';  // FIXME buggy Resize box
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
    let classString = Array(...firstMessage.classList).join(' ');
    let printMe = [`<span class='${classString}' id='connect_home' style='line-height:1;text-decoration:none;background-color:#00F0C015'>home</span>`];
    walk(printMe, serversList, networkTree.home, '', classString);
    scriptLogMessagePool.firstChild.style.lineHeight = 1.1;
    scriptLogMessagePool.firstChild.innerHTML = printMe.join('\n');
    /* Functionality: connect, root status, backdoor+status */
    for (let server of serversList) {
        let connectElem = doc.querySelector(`#connect_${server.hostname.replaceAll('.', 'DOT')}`);
        let connectCommand = await pathToServer(JSON.stringify(serversList), server.hostname);
        if (connectElem) {
            connectElem.onclick = function () {
                executeTerminalCommand(connectCommand);
            };
        }
        let nukeElem = doc.querySelector(`#nuke_${server.hostname.replaceAll('.', 'DOT')}`);
        if (nukeElem) {
            let nukeSymbol = '☢';
            if (!server.hasAdminRights) {
                nukeSymbol = '⛝';
                let nukeCommand = 'run BruteSSH.exe; run FTPCrack.exe; run relaySMTP.exe; run HTTPWorm.exe; run SQLInject.exe; run NUKE.exe';
                nukeElem.onclick = function () {
                    executeTerminalCommand(`${connectCommand}; ${nukeCommand}`);
                }
            }
            nukeElem.innerText = nukeSymbol;
        }
        let backdoorElem = doc.querySelector(`#backdoor_${server.hostname.replaceAll('.', 'DOT')}`);
        if (backdoorElem) {
            let backdoorSymbol = '⚿';
            if (!server.backdoorInstalled) {
                backdoorSymbol = '⛝';
                backdoorElem.onclick = function () {
                    executeTerminalCommand(`${connectCommand}; backdoor`);
                }
            }
            backdoorElem.innerText = backdoorSymbol;
        }
    }
    //flatten Array(...document.getElementsByClassName("prefix-tree-hide")).map(x => x.hidden=!x.hidden)
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
        let treePrefix = `<span class='${classString} prefix-tree-hide' style='line-height:1;'>${prefix}${parts[0]}</span>`;
        let payload = `<span class='${classString}' id='connect_${hostnames[host].replaceAll('.', 'DOT')}' style='line-height:1;text-decoration:none;background-color:#00F0C015'>${hostnames[host]}</span>`;
        let stats = `<span class='${classString}' id='nuke_${hostnames[host].replaceAll('.', 'DOT')}' style='line-height:1;'></span><span class='${classString}' id='backdoor_${hostnames[host].replaceAll('.', 'DOT')}' style='line-height:1;'></span>`;
        printMe.push(`${treePrefix}${payload}${stats}`);
        walk(printMe, serversList, tree[hostnames[host]], `${prefix}${parts[1]}`, classString);
    }
}