/* eslint-disable no-console */
import postcss from 'postcss'

type SelectorMap = Map<string, Set<string>>
type DeclarationMap = Map<string, { prop: string, value: string }[]>
// Helper function to append grouped selectors to the given root or at-rule
function appendGroupedSelectors(target: any, selectorsMap: SelectorMap, unifiedDeclarations: DeclarationMap) {
  console.groupCollapsed('appendGroupedSelectors', target, selectorsMap)
  selectorsMap.forEach((selectors, declaration) => {
    console.groupCollapsed(declaration)
    const [prop, value] = declaration.split(': ')
    console.log(`prop: ${prop}, value: ${value}`)
    console.log(selectors)
    const selectorsArray = Array.from(selectors)
    console.log(selectorsArray)
    if (selectorsArray.length === 1) {
      const onlySelector = selectorsArray[0]
      console.info('onlySelector', onlySelector)
      const isEmpty = unifiedDeclarations.size === 0
      if (isEmpty) {
        if (unifiedDeclarations.has(onlySelector)) {
          const existingDeclarations = unifiedDeclarations.get(onlySelector) || []
          unifiedDeclarations.set(onlySelector, [...existingDeclarations, { prop, value }])
          console.log('pushing to exising rule', unifiedDeclarations.get(onlySelector))
        }
        else {
          unifiedDeclarations.set(onlySelector, [{ prop, value }])
          console.log('creating new rule', unifiedDeclarations.get(onlySelector))
        }
      }
    }
    else {
      const newRule = postcss.rule({ selectors: selectorsArray })
      newRule.append({ prop, value })
      console.log('New Rule', newRule)
      target.append(newRule)
    }
    console.groupEnd()
  })
  console.groupEnd()
}

function myPlugin(opts = {}) {
  return {
    postcssPlugin: 'myPostCSSPlugin',
    Once(root: postcss.Root) {
      console.log('Options', opts)
      const groupedSelectors = new Map() // Global scope
      const atRules = new Map() // For storing @media and other at-rules

      root.walkRules((rule) => {
        console.groupCollapsed(`Selector ${rule.selector}`)
        // For each rule, decide if it's under an @-rule or in the global scope
        const parent = rule.parent
        let targetMap = groupedSelectors
        console.log(`Parent ${parent}`)

        if (parent?.type === 'atrule') {
          console.log('We are in an @-rule')
          if (!atRules.has(parent))
            atRules.set(parent, new Map())

          targetMap = atRules.get(parent)
        }

        rule.walkDecls((decl) => {
          console.log(`${decl.prop}: ${decl.value}`)
          const key = `${decl.prop}: ${decl.value}`
          if (!targetMap.has(key))
            targetMap.set(key, new Set())

          if (rule.selector.startsWith('&')) {
            const parentSelector = rule.parent?.selector
            const newSelector = rule.selector.replace('&', parentSelector)
            targetMap.get(key).add(newSelector)
          }
          else {
            targetMap.get(key).add(rule.selector)
          }
          console.info(targetMap)
        })
        console.groupEnd()
      })

      // Clear the CSS root for re-insertion of processed rules
      console.warn('removing all rules from root')
      root.removeAll()

      // Handle grouped selectors in the global scope
      console.warn('creating new rules')
      console.info(groupedSelectors)
      // a temporary array to store all delcarations that could be group into one rules
      const unifiedDeclarations = new Map()
      appendGroupedSelectors(root, groupedSelectors, unifiedDeclarations)

      console.warn('creating new rules from unified declarations')
      const newUnif = new Map()
      appendGroupedSelectors(root, unifiedDeclarations, newUnif)
      console.info('newUnif', newUnif)
      unifiedDeclarations.forEach((declarations, selector) => {
        console.log('Selector', selector)
        const newRule = postcss.rule({ selector })
        declarations.forEach(({ prop, value }) => {
          newRule.append({ prop, value })
        })
        console.log('Unify rules', newRule)
        root.append(newRule)
      })

      // Process each @-rule
      console.warn('creating @Rule declarations')
      console.log('Processing @-rules', atRules)
      atRules.forEach((selectorsMap, atRule) => {
        console.log(atRule, selectorsMap)
        const newAtRule = postcss.atRule({
          name: atRule.name,
          params: atRule.params,
        })

        appendGroupedSelectors(newAtRule, selectorsMap, unifiedDeclarations)
        root.append(newAtRule)
      })
      console.info('Done')
    },
  }
}
myPlugin.postcss = true

export default myPlugin
