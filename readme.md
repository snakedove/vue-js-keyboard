## vue-js-keyboard ##
A virtual synthesizer, made as vue component, ready to use.

### What is this repo for ###
* It contains a ready-to use vue component, a virtual javascript synthesizer to be playey with the keys on your keyboard or your pointer device. It is declared as a global component with `Vue.component()`, so it can be used inside the components declaration inside a vue instance or directly in the markup.

### Usage ###
* Create a parent element for the component in your markup, e.g. `<div id="app"></div>`
* In your html document, import vue, e.g. `https://cdn.jsdelivr.net/npm/vue`
* From this library, use the compiled javascript in the dist folder or your script tag `https://raw.githubusercontent.com/snakedove/vue-js-keyboard/master/dist/keyboard.js`
* From this library, use the compiled css in the dist folder `https://raw.githubusercontent.com/snakedove/vue-js-keyboard/master/dist/keyboard.css`
* Create your own javascript where you create a vue instance and use the component, e.g.
```javascript
new Vue({
    el: '#app',
    template: `<div id="app"><keyboard /></div>`
});
```
* add some style for the wrapper, for example:
```html
<style type="text/css">
    html, body {
      width: 100%;
      height: 100%;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: Verdana, sans-serif;
      position: fixed;
    }

    #app {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
    }
</style>
```
* or import the `Keyboard` component e.g. `import Keyboard from './keyboard'` and use it in your components
