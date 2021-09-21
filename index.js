let parser = require('postcss-selector-parser')

let processor = parser(rule => {
  rule.each(selector => {
    let lastSelectorsList = new Set([selector])
    let detectedPseudoIs = false

    selector.walkPseudos(pseudo => {
      if (pseudo.value !== ':is') return

      detectedPseudoIs = true
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

    if (detectedPseudoIs) {
      lastSelectorsList.forEach(lastSelector => {
        selector.parent.insertBefore(selector, lastSelector)
      })

      selector.remove()
    }
  })
})

module.exports = () => {
  return {
    postcssPlugin: 'postcss-pseudo-is',
    Rule(rule) {
      if (!rule.selector || !rule.selector.indexOf(':is') === -1) {
        return
      }

      processor.processSync(rule, {
        lossless: false,
        updateSelector: true
      })
    }
  }
}

module.exports.postcss = true
