const player = (name) => {

  function takeTokens(tokensRemaining) {
    if (tokensRemaining) {
      const taken = Math.min(
        tokensRemaining,
        Math.ceil(Math.random() * 3)
      )

      console.log(`${name} takes ${taken} token${taken > 1 ? "s" : ""}`)

      return taken

    } else {
      console.log(`${name} wins!`)
    }
  }

  return takeTokens
}

module.exports = player