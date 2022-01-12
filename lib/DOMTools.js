/**
 * Tools that manipulate or read data from the DOM.
 * Might fail after an update.
 */


/**
 * Runs a command in terminal.
 * @param {String} command
 */
export function executeTerminalCommand(command) {
    const doc = eval("document");
    const terminal = doc.querySelector("#terminal-input");
    if (terminal && !terminal.hasAttribute("disabled")) {
        const keys = Reflect.ownKeys(terminal);
        terminal.value = command;
        terminal[keys[1]].onChange({ target: terminal });
        terminal[keys[1]].onKeyDown({ keyCode: 13, preventDefault: () => null });
    }
}