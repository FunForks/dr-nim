/**
 * The game of Linear Nim starts with a given number of tokens.
 * Players take turns to remove one or more tokens, up to a
 * maximum number. The player who takes the last token is the
 * winner.
 * 
 * You can set the inital number of tokens, and the maximum 
 * number that can be taken on each turn by custominging the
 * INITIAL_TOKEN_COUNT and MAX_TAKEN constants.
 */


// Import functions from subfolders of the parent folder
const players = require('./Utilities/get_players')

// You can alter the rules of the game
const INITIAL_TOKEN_COUNT = 12
const MAX_TAKEN = 3

const GAMES_TO_PLAY = 2 // two rounds per game
const ROUNDS_TO_PLAY = GAMES_TO_PLAY * 2

// Customize how much output appears in the Terminal window
const LOG_EACH_RESULT = GAMES_TO_PLAY < 12
const LOG_EACH_GAME = GAMES_TO_PLAY < 6
const LOG_EACH_TURN = GAMES_TO_PLAY < 3

if (players.length > 1) {
  playGame(players)
} else {
  console.log("There are not enough players:", players)
}

function playGame(players) {
  let rounds = ROUNDS_TO_PLAY
  const wins = {
    [players[0].name]: 0,
    [players[1].name]: 0
  }

  while(rounds--) {
    // Alternate starting player
    let currentPlayer = rounds % 2

    let tokensRemaining = INITIAL_TOKEN_COUNT
    const round = GAMES_TO_PLAY * 2 - rounds
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

    while (tokensRemaining) {
      const { name, player } = players[currentPlayer]

      //// HERE IS WHERE YOUR player FUNCTION IS CALLED ////
      const taken = player(tokensRemaining, MAX_TAKEN)

      // Use an Immediately Invoked Function Expression (IIFE)
      // https://flaviocopes.com/javascript-iife/
      const foulPlay = (() => {
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
            ` and ${name} will be banned from future events.`
          ]
        }
        if ( taken > MAX_TAKEN ) {
          return [
            `${name} took more than ${MAX_TAKEN} tokens (${taken}).`,
            ` through disqualification of ${name}`
          ]
        }

        return false
      })()


      if (foulPlay) {
        // Switch players to declare the winner
        currentPlayer = 0 + !currentPlayer
        const [ foul, sanction ] = foulPlay
        const winner = players[currentPlayer].name

        // Announce the result
        console.log(`${foul} ${winner} wins${sanction}.`)
        return // leave the entire function, abandon the match

      } else {
        // Update state of play
        tokensRemaining -= taken

        if (LOG_EACH_GAME && LOG_EACH_TURN) {
          // Provide commentary on play
          const tokens = taken === 1
                       ? "1 token"
                       : `${taken} tokens`

          const remaining = tokensRemaining === 1
                          ? "1 token"
                          : `${tokensRemaining} tokens`

          console.log(`${name} takes ${tokens}, leaving ${remaining}.`)
        }

        // Check if there is a winner
        if (!tokensRemaining) {
          if (LOG_EACH_RESULT) {
            console.log(`${name} wins round ${round}!`)
          }
          wins[name] += 1
          break // leave the inner `while` loop early 
        }

        // It's the other player's turn now
        currentPlayer = 0 + !currentPlayer
      }
    }
  }

  console.log("\nWins:", wins)
}