DaisywheelJS
============

The [Steam "Big Picture"](http://store.steampowered.com/bigpicture/) Daisywheel ported to Javascript and CSS. Works with the [Gamepad API](http://www.w3.org/TR/gamepad/), available in the latest modern browsers.

####Note
This interface is something every game with text input needs. Not a single game should present a *QWERTY* keyboard to a user with a controller in their hands. I ported this so that the growing HTML5 gaming community can use it in their games as a standard library in the user interface toolkit.

![DaisywheelJS Screenshot](http://imgur.com/087i4Rp.png)

A live demo can be found [here](http://daisywheeljs.org)

###Controls
 + **Left Analog Stick**: Select group/petal.
 + **Face Buttons**: Select symbol from group/petal.
 + **Right Shoulder Button**: Toggle capital letters.
 + **Left Shoulder Button**: Toggle numbers.
 
###Setup
Daisywheel's setup is simple and easily extendable. The most straightforward way to get started is by including the `daisywheel.js` library and its dependencies in script tags, including the `daisywheel.css` file on the page or in the build process, and then adding the daisywheel CSS class to whatever input or textarea tag the tool will provide input for.

```html


<link rel="stylesheet" type="text/css" href="css/lib/daisywheel.css">

...

<input class="daisywheel">

...

<script src="js/lib/underscore-min.js"></script>
<script src="js/lib/gamepad-mod.js"></script>

<script src="js/lib/daisywheel.js"></script>

```

That's it! Whenever the 'focus' event for that input is fired the Daisywheel UI will automatically appear, allowing the user to enter text with their gamepad without having to switch to their keyboard.

####Dependencies

 + [Underscore](http://underscorejs.org/underscore-min.js), common javascript utility belt.
 + [Gamepad-mod.js](https://raw.githubusercontent.com/likethemammal/daisywheeljs/master/gamepad-mod.js), library that interfaces with the Gamepad API and feeds Daisywheel its data.

####Options and Extensions

#####Manually loading and unloading

Daisywheel can be manually loaded and unloaded by calling `load` and `unload` respectively on the global `Daisywheel` object. The `load` function expects a single callback parameter which will return the symbols, as they're selected, to be used as needed.

```js

//When the Daisywheel should appear
Daisywheel.load(function(symbol) {
  console.log(symbol);
});


//When the Daisywheel should close
Daisywheel.unload();

```

#####Custom symbol sets

A custom set of symbols can be sent into Daisywheel to add support for multiple languages, emojis, etc. The `symbols` function expects an array of objects, each with a `set` and an `override` attribute.

```js

//Adding Japanese Katakana alphabet
Daisywheel.symbols([{
  set: ["あ", "い", "う", "え", "お", "か", "き", "く", "け", ....],
  override: true,
  title: 'Japanese (Katakana)'
}]);


//Adding Emoji support
Daisywheel.symbols([{
  set: [
    {
      symbol: '&#x1F344;'
      font: 'EmojiSymbols'
    },
    {
      symbol: '&#x1F31E;'
      font: 'EmojiSymbols'
    },
  ],
  override: true,
  title: 'Emoji Symbols'
}]);

```

The `set` property is the array of symbols (a string or an object) that will be displayed. For symbols that are a single character each a single concatinated string can be used. If the symbol is not supported by utf-8 (i.e. emojis) then the `font` attribute within the symbol's object should be set to the `font-family` of the desired font (remember to include the font file if it is not support by default).

The `override` property is a boolean that determines whether the symbol set will 'override' one of the default sets or not, meaning if more than 3 symbol sets have an override property of `true` the defaults will not be shown at all.

The `title` property is required if the `override` property is set. It's the string that's used to label the control for its corresponding symbol set.

###Attributions
`gamepad-mod.js` interfaces with the browser API and organizes the data sent over in the controller's events. It was a modification of the `gamepad.js` library found in the example code for the [HTML5Rocks gamepad tester](http://www.html5rocks.com/en/tutorials/doodles/gamepad/), which can be found in its orginal form [here](https://github.com/html5rocks/www.html5rocks.com/blob/master/content/tutorials/doodles/gamepad/static/gamepad-tester/gamepad.js)

##License
This is licensed under the [MIT Open-source License](https://github.com/likethemammal/daisywheeljs/blob/master/LICENSE.txt).

---------------------

####todo
 + switch trigger buttons to be 'hold down' instead of toggles.
 + multilanguage support
 + controller brand specific button images
 + complex actions (attach to a text editor like [Atom](https://atom.io/) or [Light Table](http://www.lighttable.com/))
 + emoji support (must include snowman!)
