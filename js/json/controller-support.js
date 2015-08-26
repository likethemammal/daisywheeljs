var React = require('react');
var DS3WindowsInfo = (
    <p>
        Try this <a href="http://www.reddit.com/r/ffxiv/comments/1l21zb/playing_with_a_ps3_controller_on_pc_a_setup_guide">tutorial</a>, with more specific details in this comment <a href="http://www.reddit.com/r/ffxiv/comments/1l21zb/playing_with_a_ps3_controller_on_pc_a_setup_guide/cdiu549">here</a>
    </p>
);

module.exports = {
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
                info: '',
                version: []
            },
            firefox: {
                support: 'supported',
                info: '',
                versions: []
            }
        }
    },
    'Xbox 360': {
        windows: {
            chrome: {
                support: 'supported',
                info: '',
                versions: []
            }
        }
    },
    'Gamecube': {

    }
};