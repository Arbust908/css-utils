import postcss from 'postcss'

// Helper function to append grouped selectors to the given root or at-rule
function appendGroupedSelectors(target, selectorsMap) {
  selectorsMap.forEach((selectors, declaration) => {
    const [prop, value] = declaration.split(': ');
    const newRule = postcss.rule({ selectors: Array.from(selectors).join(', ') });
    newRule.append({ prop, value });
    target.append(newRule);
  });
}

function myPlugin(opts = {}) {
  return {
    postcssPlugin: 'myPostCSSPlugin',
    Once(root) {
      const declarationsMap = new Map()
      console.log('Options', opts)
      // First, gather all declarations and the selectors that use them
      console.warn('grouping declarations by selector')
      root.walkRules((rule) => {
        console.groupCollapsed(rule.selector)
        rule.walkDecls((decl) => {
          console.log(`${decl.prop}: ${decl.value}`)
          const key = `${decl.prop}: ${decl.value}`
          if (!declarationsMap.has(key))
            declarationsMap.set(key, new Set())
          if (rule.selector.startsWith('&')) {
            const parentSelector = rule.parent.selector
            const newSelector = rule.selector.replace('&', parentSelector)
            declarationsMap.get(key).add(newSelector)
          }
          else {
            declarationsMap.get(key).add(rule.selector)
          }
          console.info(declarationsMap)
        })
        console.groupEnd()
      })
      console.warn('removing all rules from root')
      // Clear the CSS root for re-insertion
      root.removeAll()

      console.warn('creating new rules')
      console.info(declarationsMap)
      // a temporary array to store all delcarations that could be group into one rules
      const unifiedDeclarations = new Map()
      // For each unique declaration, create a new rule combining all selectors
      declarationsMap.forEach((selectors, declaration) => {
        console.groupCollapsed(declaration)
        const [prop, value] = declaration.split(': ')
        console.log(`prop: ${prop}, value: ${value}`)
        console.log(selectors)
        const selectorsArray = Array.from(selectors)
        console.log(selectorsArray)
        if (selectorsArray.length === 1) {
          const onlySelector = selectorsArray[0]
          console.info('onlySelector', onlySelector)
          if (unifiedDeclarations.has(onlySelector)) {
            const existingDeclarations = unifiedDeclarations.get(onlySelector)
            unifiedDeclarations.set(onlySelector, [...existingDeclarations, { prop, value }])
            console.log('pushing to exising rule', unifiedDeclarations[onlySelector])
          }
          else {
            unifiedDeclarations.set(onlySelector, [{ prop, value }])
            console.log('creating new rule', unifiedDeclarations[onlySelector])
          }
          console.groupEnd()
        }
        else {
          const newRule = postcss.rule({ selectors: selectorsArray })
          newRule.append({ prop, value })
          console.log('New Rule', newRule)
          root.append(newRule)
          console.groupEnd()
        }
      })
      console.warn('creating new rules from unified declarations')
      unifiedDeclarations.forEach((declarations, selector) => {
        console.log('Selector', selector)
        const newRule = postcss.rule({ selector })
        declarations.forEach(({ prop, value }) => {
          newRule.append({ prop, value })
        })
        console.log('New Rule', newRule)
        root.append(newRule)
      })
    },
  }
}
myPlugin.postcss = true

export default myPlugin
