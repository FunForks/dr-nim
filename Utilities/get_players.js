/**
 * This script uses built-in node modules to read local files and
 * folders. It looks for directories in the same folders as itself
 * which:
 * 
 * • Contain a file named player.js...
 * • Which exports a function
 * 
 * It exports an array of objects, with the format:
 * 
 *   [ { 
 *       name: <name of parent folder>,
 *       player: <function exported from player.js
 *     }
 *   , ...
 *   ]
 * 
 * At least two valid player objects are required for the game to play.
 */


// Built-in node modules for creating file paths reading from hard disk
const path = require('path');  // https://nodejs.org/api/path.html
const fs = require('fs');      // https://nodejs.org/api/fs.html


// Read the names of the files and folders in the parent directory
// https://nodejs.org/api/path.html#pathjoinpaths
const parent = path.join(__dirname, "..")
// https://nodejs.org/api/fs.html#fsreaddirsyncpath-options
const entities = fs.readdirSync(parent)
// [".git", "nim.js", "Champion", "Challenger", "Utilities"]


// Filter out files and folders with no index.js
const folders = entities.filter( item => {
  // https://nodejs.org/api/fs.html#fslstatsyncpath-options
  // https://nodejs.org/api/fs.html#direntisdirectory
  if (fs.lstatSync(item).isDirectory()) {
    // https://nodejs.org/api/path.html#pathjoinpaths
    const indexFile = path.join(parent, item, "player.js")

    // https://nodejs.org/api/fs.html#fsexistssyncpath
    if (!fs.existsSync(indexFile)){
      // index.js is not found in this folder
      return false
    }

    // Ensure that index.js is an actual file
    // https://nodejs.org/api/fs.html#direntisfile
    return fs.lstatSync(indexFile).isFile()
  }

  return false
}) // ["champion", "challenger"]


// Create a players list from index.js filesthat export a valid function
const players = folders.map( name => {
  const indexPath = path.join(parent, name, "player")
  const player = require(indexPath)
  return { name, player }
}).filter( playerObject => (
  // Filter out any folders whose index.js does not export a function
  typeof playerObject.player === "function"
))


module.exports = players