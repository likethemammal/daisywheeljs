var React = require('react');
var DS3WindowsInfo = (
    <p>
        Try installing Xinput. <a target="_blank" href="http://forums.pcsx2.net/Thread-XInput-Wrapper-for-DS3-and-Play-com-USB-Dual-DS2-Controller">Here's a tutorial</a>, with more specific details (to connect bluetooth) on <a target="_blank" href="http://forums.pcsx2.net/Thread-XInput-Wrapper-for-DS3-and-Play-com-USB-Dual-DS2-Controller?pid=334141#pid334141">this page</a>. <a target="_blank" href="http://emulation-general.wikia.com/wiki/MotioninJoy">MotioninJoy</a> is also an option, but it's interface is awful, and could be virus-prone.
    </p>
);

var SixaxisLinux = (
    <p>
    There is a <a target="_blank" href="https://help.ubuntu.com/community/Sixaxis">Linux package</a> for using the Sixaxis and Dualshock 3 controllers. It can be found <a target="_blank" href="https://help.ubuntu.com/community/Sixaxis">here</a>
    </p>
);

module.exports = {
    'PS3 Sixaxis': {
        linux: {
            chrome: {
                support: 'supported',
                info: SixaxisLinux,
                version: []
            },
            firefox: {
                support: 'supported',
                info: SixaxisLinux,
                version: []
            }
        }
    },
    'PS3 Dualshock 3': {
        windows: {
            chrome: {
                support: 'supported',
                info: DS3WindowsInfo,
                versions: []
            },
            firefox: {
                support: 'supported',
                info: DS3WindowsInfo,
                versions: []
            }
        },
        linux: {
            chrome: {
                support: 'supported',
                info: SixaxisLinux,
                version: []
            },
            firefox: {
                support: 'supported',
                info: SixaxisLinux,
                versions: []
            }
        },
        'chrome os': {
            chrome: {
                support: 'supported',
                info: 'Should connect through bluetooth.',
                version: []
            }
        }
    },
    'Xbox 360': {
        windows: {
            chrome: {
                support: 'supported',
                info: (
                    <p>
                        'Plug and Play. Should just work out of the box. May need to install <a href="https://www.microsoft.com/hardware/en-us/d/xbox-360-controller-for-windows">drivers.</a>'
                    </p>),
                versions: []
            }
        },
        linux: {
            chrome: {
                support: 'supported',
                info: (
                    <p>
                       "xboxdrv" is a package available to Linux for connecting an Xbox 360 controller. This tutorial is for PS3 controllers but it works with either. <a target="_blank" href="http://danielj.se/2013/04/26/how-to-get-your-playstation-3-dualshock-3-sixaxis-controller-to-work-on-linux/">http://danielj.se/2013/04/26/how-to-get-your-playstation-3-dualshock-3-sixaxis-controller-to-work-on-linux/</a>
                    </p>
                    ),
                versions: []
            }
        }
    },
    'Gamecube': {

    }
};