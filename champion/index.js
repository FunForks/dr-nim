// const champion = (name) => {
//   return takeTokens = (tokensRemaining) => {
//     const play = () => {
//       let excess = tokensRemaining % 4

//       if (!excess) {
//         excess = Math.ceil(Math.random() * 3)
//       }

//       console.log(
//         `${name} takes ${excess} token${excess > 1 ? "s" : ""}`
//       )

//       return excess
//     }

//     switch (tokensRemaining) {
//       case 0:
//         return console.log(`${name} wins!`)

//       case -1:
//         console.log(`${name} accuses opponent of cheating.`)
//         return tokensRemaining

//       default:
//         return play()
//     }
//   }
// }

// module.exports = champion


module.exports=e=>(o=>{switch(o){case 0:return console.log(`${e} wins!`);case-1:return console.log(`${e} accuses opponent of cheating.`),o;default:return(()=>{let n=o%4;return n||(n=Math.ceil(3*Math.random())),console.log(`${e} takes ${n} token${n>1?"s":""}`),n})()}});