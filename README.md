[![npm version](https://badge.fury.io/js/postcss-pseudo-is.svg)](https://www.npmjs.com/package/postcss-pseudo-is)

# PostCSS Pseudo Is

[PostCSS] plugin to transform the :is() CSS pseudo-class into more compatible CSS selectors.

[PostCSS]: https://github.com/postcss/postcss

## Example
##### Write less
```css
.button:is(:hover, :focus, :active) {
  /* Input example */
}
```

```css
.button:hover,
.button:focus,
.button:active {
  /* Output example */
}
```

##### Simplify
```css
:is(section, article, aside, nav)
:is(section, article, aside, nav) h1 {
  /* Input example */
}
```

```css
section section h1, section article h1, section aside h1, section nav h1,
article section h1, article article h1, article aside h1, article nav h1,
aside section h1, aside article h1, aside aside h1, aside nav h1,
nav section h1, nav article h1, nav aside h1, nav nav h1 {
  /* Output example */
}
```

## :warning: Warning :warning:

This is **not** an implementation or a polyfill for the `:is()` pseudo-class but a very simple syntax-sugar.
It has a huge amount of [limitations](#limitations) thus please do not use any complex selector you may want to use.


## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-pseudo-is'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage


## Limitations
 - The specificity of the `:is()` pseudo-class is not replaced by the specificity of its most specific argument
 - Not avoiding selector list invalidation
 - Can't handle complex selectors
 - And much more...
