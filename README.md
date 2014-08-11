DaisywheelJS
============

The [Steam "Big Picture"](http://store.steampowered.com/bigpicture/) Daisywheel ported to Javascript and CSS. Works with the [Gamepad API](http://www.w3.org/TR/gamepad/), available in the latest modern browsers.

####Note
This interface is something every game with text input needs. Not a single game should present a *QWERTY* keyboard to a user with a controller in their hands. I ported this so that the growing HTML5 gaming community can use it in their games as a standard library in the user interface toolkit.

![DaisywheelJS Screenshot](http://imgur.com/087i4Rp.png)

A live demo can be found [here](http://likethemammal.github.io/daisywheeljs/)

###Controls
 + **Left Analog Stick**: Select group/petal.
 + **Face Buttons**: Select symbol from group/petal.
 + **Right Shoulder Button**: Toggle capital letters.
 + **Left Shoulder Button**: Toggle numbers.

###Attributions
`gamepad-mod.js` interfaces with the browser API and organizes the data sent over in the controller's events. It was a modification of the `gamepad.js` library found in the example code for the [HTML5Rocks gamepad tester](http://www.html5rocks.com/en/tutorials/doodles/gamepad/), which can be found in its orginal form [here](https://github.com/html5rocks/www.html5rocks.com/blob/master/content/tutorials/doodles/gamepad/static/gamepad-tester/gamepad.js)

---------------------

####todo
 + switch trigger buttons to be 'hold down' instead of toggles.
 + multilanguage support
 + controller brand specific button images
 + complex actions (attach to a text editor like [Atom](https://atom.io/) or [Light Table](http://www.lighttable.com/))
 + emoji support (must include snowman!)
