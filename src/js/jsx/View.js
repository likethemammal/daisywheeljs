var React = require('react');
var Fluxxor = require('fluxxor');
var Modal = require('../jsx/Modal.js');
var _ = require('underscore');
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
        };
    },

    componentDidMount: function() {
        var fontLinkStr = 'http://fonts.googleapis.com/css?family=Montserrat',
            link = document.createElement('link');

        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = fontLinkStr;

        document.head.appendChild(link);
        this.refs.daisywheel.getDOMNode().addEventListener('click', this.onClickClose);
    },

    componentWillMount: function() {
        document.addEventListener('focus', this.onFocus, true);
        window.addEventListener('keyup', _.bind(this.onKeyboardClose, this));
    },

    componentWillUnmount: function() {
        document.removeEventListener('focus', this.onFocus, true);
        window.removeEventListener('keyup', _.bind(this.onKeyboardClose, this));
        this.refs.daisywheel.getDOMNode().removeEventListener('click', this.onClickClose);
    },

    onClickClose: function(ev) {
        var el = ev.target;
        if (this.state.loaded && el.id !== 'daisywheel-input') {
            flux.actions.unload();
        }
    },

    onKeyboardClose: function(ev) {
        if (ev.which === 27 && this.state.loaded) {
            flux.actions.unload();
        }
    },

    onFocus: function(ev) {
        var el = ev.target;
        if (el.classList && el.classList.contains('daisywheel') && !this.state.loaded) {
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