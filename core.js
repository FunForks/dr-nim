const path = require('path');
const fs = require('fs');

const players = fs.readdirSync(__dirname)
                  .filter( item => (
                     item[0]!=="."&& fs.lstatSync(item).isDirectory())
                   )
                  .map( name => {
                    const player = require(`./${name}/index`)
                    return player(name)
                  })

const playGame = (players) => {
  let rounds = 100
  const wins = [0, 0]

  while(rounds--) {
    console.log("************************\nThere are 12 tokens")

    let tokensRemaining = 12
    let player = Math.floor(Math.random() * 2)
    while (tokensRemaining) {
      player = 0 + !player

      const tokensTaken = players[player](tokensRemaining)

      const foulPlay = () => {
        if ( isNaN(tokensTaken) ) {
          return true
        }
        if ( tokensTaken < 1 ) {
          return true
        }
        if ( tokensTaken > tokensRemaining ) {
          return true
        }
        if ( tokensTaken > 3 ) {
          return true
        }

        return false
      }

      if (foulPlay()) {
        player = 0 + !player
        players[player](-1)
        console.log("wins:", wins)
        return

      } else {
        tokensRemaining -= tokensTaken

        const amount = tokensRemaining === 1
                     ? "is 1 token"
                     : `are ${tokensRemaining} tokens`
        console.log(`There ${amount} remaining`)
      }
    }

    players[player](tokensRemaining)
    wins[player] += 1
  }

  console.log("wins:", wins)
}

playGame(players)