/**
 * Prints the filesystem tree.
 * @alias tree='run /iBreakEverything/util/Tree.js'
 * @usage tree <hostname>
 * @param {import('..').NS} ns
 * @arg {String} hostname Target
 */
export async function main(ns) {
    const FORMAT_COMAND = true;
    const LINE_HEIGHT = 1.1;

    let tree = {};
    if (ns.args[0]) {
        if (!ns.serverExists(ns.args[0])) {
            ns.tprint(`ERROR: Host ${ns.args[0]} does not exists.`);
            return;
        }
    }
    
    let files = ns.ls(ns.args[0] || 'home');
    
    for (let file of files) {
        let path = file.split('/').filter(x => x);
        let cursor = tree;
        for(let part in path) {
            if (part == path.length - 1) {  // file; add
                if (!cursor._files) {
                    cursor._files = {};
                }
                let split = path[part].split('.');
                if (split.length < 1) {
                    ns.tprint('ERROR: anomaly found: file without extension or empty folder');
                } else {
                    let ext = split[split.length - 1];
                    if (!cursor._files[ext]) {
                        cursor._files[ext] = [];
                    }
                    cursor._files[ext].push(path[part]);
                }
            } else {  // folder; navigate
                if (!cursor[path[part]]) {
                    cursor[path[part]] = {};
                }
                cursor = cursor[path[part]];
            }
        }
    }
    const counts = { dirs: 0, files: 0 };
    let printMe = ['/'];
    walk(printMe, tree, '', counts);
    printMe.push(`\n${counts.dirs} directories, ${counts.files} files`);
    ns.tprint(`INFO: Filesystem tree\n${printMe.join('\n')}`);
    if (FORMAT_COMAND) {
        await ns.sleep(50);
        formatCommand(LINE_HEIGHT);
    }
}

/**
 * From https://github.com/kddnewton/tree/blob/main/tree.js
 * @param {Array<String>} printMe lines of text output
 * @param {{}} dir Current directory
 * @param {String} prefix Prefix of text output
 * @param {{}} counts Counting Object
 * @param {Number} counts.dirs Directory count
 * @param {Number} counts.files File count
 */
function walk(printMe, dir, prefix, counts) {
    let folders = Object.keys(dir).filter(x => x != '_files');
    let files = Object.keys(dir).filter(x => x == '_files');
    for(let folder in folders) {
        const parts = folder == folders.length + files.length - 1 ? ['└── ', '    '] : ['├── ', '│   '];
        printMe.push(`${prefix}${parts[0]}${folders[folder]}`);
        counts.dirs += 1;
        walk(printMe, dir[folders[folder]], `${prefix}${parts[1]}`, counts);
    }
    if (files.length > 0) {
        let types = Object.keys(dir._files);
        for (let typeIndex in types) {
            let type = types[typeIndex];
            for (let file in dir._files[type]) {
                let parts = (file == dir._files[type].length - 1) && (typeIndex == types.length - 1) ? '└── ' : '├── ';
                printMe.push(`${prefix}${parts}${dir._files[type][file]}`);
                counts.files += 1;
            }
        }
    }
}

/**
 * Formats the tree command to be more compact.
 */
function formatCommand(lineHeight) {
    let doc = eval("document");
    doc.querySelector('#terminal').lastChild.firstChild.style.lineHeight = lineHeight;
}