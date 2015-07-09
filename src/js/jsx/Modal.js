var React = require('../libs/react.0.13.3.js');
var Warning = require('./Warning.js');
var Wheel = require('./Wheel.js');
var _ = require('../libs/underscore.1.8.3.js');

module.exports = React.createClass({
    displayName: "Modal",
    getInitialState: function() {
        return {
            scale: 1
        };
    },

    setupSize: _.throttle(function() {
        var maxSize = (window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight,
            padding = 25,
            scalePrecision = 100,
            modalHeight = 1000,
            scaleAmount = Math.floor(scalePrecision * (maxSize / (modalHeight + padding*2))) / scalePrecision;

        this.setState({
            scale: scaleAmount
        });
    }, 100),

    componentDidMount: function() {
        this.setupSize();
    },

    componentWillMount: function() {
        window.addEventListener('resize', _.bind(this.setupSize, this));
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', _.bind(this.setupSize, this));
    },

    render: function() {
        var scaleStr = 'scale(' + this.state.scale + ')';
        var styles = {
            WebkitTransform: scaleStr,
            msTransform: scaleStr,
            transform: scaleStr
        };

        return (
            <div id="daisywheel-modal-overlay">
                <div id="daisywheel-modal-container">
                    <div id="daisywheel-modal" style={styles}>
                        <Warning gamepadSupported={!!window.gamepadSupportAvailable} flux={window.flux}/>
                        <Wheel flux={window.flux}/>
                    </div>
                </div>
            </div>
        );
    }
});