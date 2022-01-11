# bitburner-tools
 
## daemon

### ContractFinder
Finds contracts and displays them in the player stats gui. Includes one click connect button to to the server hosting the contract.

*Dependencies*:
* `lib/ServerObjectTools.js`
* `lib/StandaloneTools.js`
* `util/ServerMapper.js`

### ContractSolver
Finds contracts and solves them using user's own implementation to solve contracts.

*Dependencies*:
* `lib/Contracts.js`
* `util/ServerMapper.js`

### Skynet
Hacks all vulnerable servers and restarts killed hack script.

*Dependencies*:
* `lib/ServerObjectTools.js`
* `lib/StandaloneTools.js`
* `util/Hack.js`
* `util/RCE.js`
* `util/Rootkit.js`
* `util/ServerMapper.js`

---
## lib

### Contracts
Collection of functions with user's implementations for contract problems.

### ServerObjectTools
Collection of tools that manipulate a list of server objects.

*Dependencies*:
* `util/ServerMapper.js`

### StandaloneTools
Collection of various tools.

---
## util

### Hack
Basic hack for demo. Replace with your own.

### PathToServer
Prints the command to connect to host.

Create an alias to be able to use in terminal:

`path <hostname>`

*Dependencies*:
* `lib/StandaloneTools.js`
* `util/ServerMapper.js`

### RCE
Remote execute script on specified target with maximum threads.


### Rootkit
Grants administrator access on all vulnerable servers.

*Dependencies*:
* `lib/StandaloneTools.js`

### ServerMapper
Depth-first search for finding every connected server and saving information for further use.