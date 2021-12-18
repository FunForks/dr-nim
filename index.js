/**
 * YOU SHOULD NOT NEED TO MODIFY THE CODE IN THIS SCRIPT.
 *
 * YOU SHOULD WRITE THE CODE FOR THE player FUNCTION IN
 * THE SCRIPT Challenger/player.js.
 *
 * The game of Linear Nim starts with a given number of tokens.
 * Players take turns to remove one or more tokens, up to a
 * maximum number. The player who takes the last token is the
 * winner.
 *
 * You can set the inital number of tokens, and the maximum
 * number that can be taken on each turn by customizing the
 * INITIAL_TOKEN_COUNT and MAX_TAKEN constants.
 */



// Import player functions from subfolders of this folder
const players = require('./Utilities/get_players')



// You can alter the rules of the game
const INITIAL_TOKEN_COUNT = 12
const MAX_TAKEN = 3

// You can decide how many games to play
const GAMES_TO_PLAY = 2

// Each game will consist of two rounds, with each player
// starting half of the time;
const ROUNDS_TO_PLAY = GAMES_TO_PLAY * 2

// Customize how much output appears in the Terminal window
const LOG_EACH_RESULT = GAMES_TO_PLAY < 12
const LOG_EACH_GAME = GAMES_TO_PLAY < 6
const LOG_EACH_TURN = GAMES_TO_PLAY < 3



if (players.length > 1) {
  startMatch()
} else {
  console.log("There are not enough players:", players)
}



/**
 * Start the match with the first two players, alphabetically.
 * The match will halt if either player makes an illegal move.
 */
function startMatch() {
  let roundsRemaining = ROUNDS_TO_PLAY
  const wins = {
    [players[0].name]: 0,
    [players[1].name]: 0
  }

  while(roundsRemaining--) {
    // Alternate starting player
    const currentPlayer = roundsRemaining % 2
    const round = ROUNDS_TO_PLAY - roundsRemaining
    const winner = playRound(round, currentPlayer)
    wins[winner] += 1
  }

  console.log("\nWins:", wins)
}


/**
 *
 * @param {integer}  round
 *                   Used to console.log the winner of the round
 * @param {integer}  currentPlayer
 *                   0 or 1. Defines which player will start.
 *                   Alternates on every new round.
 * @returns {string} The name of the winner of this game
 */
function playRound(round, currentPlayer) {
  // Reset game variables
  let tokensRemaining = INITIAL_TOKEN_COUNT
  const name = players[currentPlayer].name

  if (LOG_EACH_GAME) {
    console.log(`
*******************************
Round ${round} of ${ROUNDS_TO_PLAY}
The game starts with ${INITIAL_TOKEN_COUNT} tokens.
Player "${name}" to start.
*******************************
    `)
  }

  while (true) {
    // The `return` statement below will break the loop
    // when tokensRemaining reaches zero

    const { name, player } = players[currentPlayer]
    tokensRemaining = takeTurn(name, player, tokensRemaining)

    // Check if there is already a winner
    if (!tokensRemaining) { // 0 || undefined
      if (LOG_EACH_RESULT) {
        const win = name === "You" ? "win" : "wins"
        console.log(`${name} ${win} round ${round}!`)
      }

      return name // break out of `while` loop and `playRound` function
    }

    // No winner yet, keep playing
    currentPlayer = 0 + !currentPlayer
  }


  function takeTurn(name, player, tokensRemaining) {
    //THIS IS WHERE YOUR player FUNCTION IS CALLED//
    const taken = player(tokensRemaining, MAX_TAKEN)
    ////////////////////////////////////////////////

    // If your function returned a value which is...
    // * Not a Number
    // * < 0
    // * > MAX_TAKEN
    // * > tokensRemaining
    // ... then your infraction will be reported and the game
    // will stop
    const foulPlay = checkForFoulPlay(name, taken, tokensRemaining)

    if (foulPlay) {
      return disqualifyPlayer(foulPlay)

    } else {
      // The game can continue
      tokensRemaining -= taken
      logGameState(name, tokensRemaining, taken)

      return tokensRemaining
    }
  }


  function checkForFoulPlay(name, taken, tokensRemaining) {
    if ( isNaN(taken) ) {
      return [
        `${name} failed to play.`,
        " by forfeit"
      ]
    }
    if ( taken < 1 ) {
      return [
        `${name} did not take at least 1 token.`,
        " by referee's decision"
      ]
    }
    if ( taken > tokensRemaining ) {
      return [
        `${name} took tokens out of their sleeve!.`,
        ` and ${name} will be banned from future events`,
      ]
    }
    if ( taken > MAX_TAKEN ) {
      return [
        `${name} took more than ${MAX_TAKEN} tokens (${taken}).`,
        ` through disqualification of ${name}`
      ]
    }

    return false
  }


  function disqualifyPlayer(foulPlay) {
    // Switch players to declare the winner
    currentPlayer = 0 + !currentPlayer
    const [ foul, sanction] = foulPlay
    const winner = players[currentPlayer].name

    // Announce the result
    console.log(`${foul} ${winner} wins${sanction}.\nFIX YOUR CODE.`)

    // Exit the node app here.
    // https://nodejs.org/api/process.html#processexitcode
    process.exit()
  }


  function logGameState(name, tokensRemaining, taken) {
    if (LOG_EACH_TURN) {
      // Provide commentary on play in the Terminal window
      const tokens = taken === 1
                   ? "1 token"
                   : `${taken} tokens`

      const remaining = tokensRemaining === 1
                      ? "1 token"
                      : `${tokensRemaining} tokens`
      const take = name === "You" ? "take" : "takes"

      console.log(`${name} ${take} ${tokens}, leaving ${remaining}.`)
    }
  }
}