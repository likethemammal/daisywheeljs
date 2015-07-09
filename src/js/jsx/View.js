var React = require('../libs/react.0.13.3.js');
var Fluxxor = require('../libs/fluxxor.1.6.0.js');
var Modal = require('../jsx/Modal.js');
var _ = require('../libs/underscore.1.8.3.js');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    displayName: 'View',
    mixins: [FluxMixin, StoreWatchMixin('WheelStore')],

    getStateFromFlux: function() {
        var wheelState = this.getFlux().store('WheelStore').getState();

        return {
            loaded: wheelState.loaded,
            showWarning: wheelState.showWarning,
            bacon: {}
        };
    },

    componentDidMount: function() {
        var fontLinkStr = 'http://fonts.googleapis.com/css?family=Montserrat',
            link = document.createElement('link');

        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = fontLinkStr;

        document.head.appendChild(link);
    },

    componentWillMount: function() {
        document.addEventListener('focus', this.onFocus, true);
        window.addEventListener('keyup', _.bind(this.onKeyboardClose, this));
    },

    componentWillUnmount: function() {
        document.removeEventListener('focus', this.onFocus, true);
        window.removeEventListener('keyup', _.bind(this.onKeyboardClose, this));
        if (this.state.clickCloseAttached) {
            this.refs.daisywheel.getDOMNode().removeEventListener('click', flux.actions.unload);
        }
    },

    componentWillUpdate: function() {
        if (this.state.loaded && !this.state.clickCloseAttached) {
            this.refs.daisywheel.getDOMNode().addEventListener('click', flux.actions.unload);
            flux.actions.clickCloseAttached();
        } else if (!this.state.loaded && this.state.clickCloseAttached) {
            this.refs.daisywheel.getDOMNode().removeEventListener('click', flux.actions.unload);
            flux.actions.clickCloseDetached();
        }
    },

    onKeyboardClose: function(ev) {
        if (ev.which === 27 && this.state.loaded) {
            flux.actions.unload();
        }
    },

    onFocus: function(ev) {
        var el = ev.target;
        if (el.classList && el.classList.contains('daisywheel')) {
            ev.preventDefault();
            flux.actions.attachInput(el);
            flux.actions.loadDefault();
        }
    },

    render: function() {
        var loaded = this.state.loaded;
        var visibility = (loaded) ? 'visible' : 'hidden';
        var opacity = (loaded) ? 1 : 0;
        var styles = {
            visibility: visibility,
            opacity: opacity
        };

        return (
            <div ref="daisywheel" id="daisywheel-js" style={styles}>
                <Modal/>
            </div>
        );
    }
});