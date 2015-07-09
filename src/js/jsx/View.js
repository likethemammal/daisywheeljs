var React = require('../libs/react.0.13.3.js');
var Fluxxor = require('../libs/fluxxor.1.6.0.js');
var Modal = require('../jsx/Modal.js');
var _ = require('../libs/underscore.1.8.3.js');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    displayName: 'View',
    mixins: [FluxMixin, StoreWatchMixin(['WheelStore', 'SymbolsStore'])],

    getStateFromFlux: function() {
        var wheelState = this.getFlux().store('WheelStore').getState();
        var symbolsState = this.getFlux().store('SymbolsStore').getState();

        return {
            loaded: wheelState.loaded,
            showWarning: wheelState.showWarning
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
        window.addEventListener('keyup', this.onKeyboardClose);
    },

    componentWillUnmount: function() {
        document.removeEventListener('focus', this.onFocus);
        window.removeEventListener('keyup', this.onKeyboardClose);
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

    onKeyboardClose: _.bind(function(ev) {
        if (ev.which === 27 && this.state.loaded) {
            var flux = this.getFlux();
            flux.actions.unload();
        }
    }, this),

    onFocus: _.bind(function(ev) {
        var el = ev.target;
        if (el.classList && el.classList.contains('daisywheel')) {
            ev.preventDefault();
            flux.actions.attachInput(el);
            flux.actions.loadDefault();
        }
    }, this),

    render: function() {
        var loaded = this.state.loaded;
        var visibility = (loaded) ? 'visible' : 'hidden';
        var opacity = (loaded && !this.state.showWarning) ? 1 : 0;
        var styles = {
            visibility: visibility,
            opacity: opacity
        };

        return (
            <div ref="daisywheel" id="daisywheel-js" styles={styles}>
                <Modal/>
            </div>
        );
    }
});