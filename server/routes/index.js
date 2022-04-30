const { readdir } = require('fs/promises')

module.exports = async () => {
  let map = {}
  const files = await readdir('./routes')
  for (const file of files) {
    if (file !== 'index.js') {
      let router = require(`./${file}`)
      map[file.replace('.js', '')] = router
    }
    
  }
  return map
}