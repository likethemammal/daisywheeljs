DaisywheelJS
============

The [Steam "Big Picture"](http://store.steampowered.com/bigpicture/) Daisywheel ported to Javascript and CSS. Works with the [Gamepad API](http://www.w3.org/TR/gamepad/), available in the latest modern browsers.

#### Note
This interface is something every game with text input needs. Not a single game should present a *QWERTY* keyboard to a user with a controller in their hands. I ported this so that the growing HTML5 gaming community can use it in their games as a standard library in the user interface toolkit.

![DaisywheelJS Screenshot](http://imgur.com/087i4Rp.png)

A live demo can be found [here](http://daisywheeljs.org)

### Setup/Install/Documentation

Instructions on use can be found at [daisywheeljs.org](http://daisywheeljs.org).

There you'll find:

 + [How-to](http://daisywheeljs.org/#how-it-works)
 + [Setup](http://daisywheeljs.org/#docs)
 + [Documentation](http://daisywheeljs.org/#docs)
 + [Troubleshooting](https://github.com/likethemammal/daisywheeljs/wiki)

### Contributing

To setup your own build and/or contribute, pull down a clone of the repo. Run `npm install` to install dependencies. After making changes to either the daisywheel.js file or the `less` files run `gulp` and a build version of the files will be generated. The process should look like this:

```

git clone git@github.com:likethemammal/daisywheeljs.git
cd daisywheeljs
npm install

//make some changes

gulp

```

### Attributions
`gamepad-mod.js` interfaces with the browser API and organizes the data sent over in the controller's events. It was a modification of the `gamepad.js` library found in the example code for the [HTML5Rocks gamepad tester](http://www.html5rocks.com/en/tutorials/doodles/gamepad/), which can be found in its orginal form [here](https://github.com/html5rocks/www.html5rocks.com/blob/master/content/tutorials/doodles/gamepad/static/gamepad-tester/gamepad.js)

## License
This is licensed under the [MIT Open-source License](https://github.com/likethemammal/daisywheeljs/blob/master/LICENSE.txt).

---------------------

#### todo
 + multilanguage support
 + controller brand specific button images
 + complex actions (attach to a text editor like [Atom](https://atom.io/) or [Light Table](http://www.lighttable.com/))