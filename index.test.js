let postcss = require('postcss')

let plugin = require('./')

async function run(input, output, opts) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

describe('One instance of :is()', () => {
  it('One selector within', async () => {
    await run(':is(h1) {}', 'h1 {}', {})
  })

  it('Two selectors within', async () => {
    await run(':is(h1, h2) {}', 'h1,h2 {}', {})
  })

  it('Two selectors within and any selector before the pseudo-class', async () => {
    await run('body :is(h1, h2) {}', 'body h1,body h2 {}', {})
  })

  it('Two selectors within and any selector after the pseudo-class', async () => {
    await run(':is(h1, h2) p {}', 'h1 p,h2 p {}', {})
  })

  it('Three selectors within and any selector after the pseudo-class', async () => {
    await run(
      ':is(ul, ol, .list) > [hidden] {}',
      'ul>[hidden],ol>[hidden],.list>[hidden] {}',
      {}
    )
  })

  it('Two selectors within and any selectors before and after the pseudo-class', async () => {
    await run('body :is(h1, h2) p {}', 'body h1 p,body h2 p {}', {})
  })

  it('One pseudo-class within attached to any selector before', async () => {
    await run('button:is(:hover) {}', 'button:hover {}', {})
  })

  it('Two pseudo-classes within attached to any selector before', async () => {
    await run(
      'button:is(:hover, :focus) {}',
      'button:hover,button:focus {}',
      {}
    )
  })

  it('Three pseudo-classes within attached to any selector before and any selector after the pseudo-class', async () => {
    await run(
      'button:is(:hover, :focus, :active) .label {}',
      'button:hover .label,button:focus .label,button:active .label {}',
      {}
    )
  })
})

describe('Multiple instances of :is()', () => {
  it('Two instances having one selector within', async () => {
    await run(':is(section) :is(section) h1 {}', 'section section h1 {}')
  })

  it('Two instances having two selectors within', async () => {
    await run(
      ':is(header, main) :is(section, article) h1 {}',
      'header section h1,header article h1,main section h1,main article h1 {}'
    )
  })

  it('Three instances having two selectors within', async () => {
    await run(
      ':is(header, main) :is(section, article) :is(h2, h3) {}',
      'header section h2,header section h3,header article h2,header article h3,main section h2,main section h3,main article h2,main article h3 {}'
    )
  })
})
