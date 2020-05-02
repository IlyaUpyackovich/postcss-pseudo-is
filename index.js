let postcss = require('postcss')
let parser = require('postcss-selector-parser')

let processor = parser(rule => {
  return new Promise(resolve => {
    rule.each(selector => {
      let lastSelectorsList = new Set([selector])

      selector.walkPseudos(pseudo => {
        if (pseudo.value !== ':is') return

        let newSelectorsList = new Set()
        let index = selector.index(pseudo)

        lastSelectorsList.forEach(lastSelector => {
          pseudo.each(innerSelector => {
            let selectorClone = lastSelector.clone()
            selectorClone.at(index).replaceWith(innerSelector)
            newSelectorsList.add(selectorClone)
          })
        })

        lastSelectorsList = newSelectorsList
      })

      lastSelectorsList.forEach(lastSelector => {
        selector.parent.insertBefore(selector, lastSelector)
      })

      selector.remove()
    })

    resolve()
  })
})

const plugin = postcss.plugin('postcss-pseudo-is', () => root => {
  let promises = []

  return new Promise((resolve, reject) => {
    root.walkRules(rule => {
      promises.push(
        processor.process(rule, { lossless: false, updateSelector: true })
      )
    })

    Promise.all(promises).then(resolve).catch(reject)
  })
})

module.exports = plugin
