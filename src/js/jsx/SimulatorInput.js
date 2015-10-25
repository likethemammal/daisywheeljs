var React = require('react');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Utils = require('../Utils.js');

module.exports = React.createClass({
    displayName: "SimulatorInput",
    mixins: [FluxMixin, StoreWatchMixin('InputStore', 'OffsetStore')],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        var offsetState = flux.store('OffsetStore').getState();
        var inputState = flux.store('InputStore').getState();

        return {
            latestCharacter: inputState.latestCharacter,
            latestCharacterChanged: inputState.latestCharacterChanged
        };
    },

    componentDidUpdate: function() {
        if (this.state.latestCharacterChanged) {
            var input = this.refs.input.getDOMNode();

            flux.actions.changeInputScroll(input.scrollWidth);
        }
    },

    render: function() {
        return (
            <input id="simulator-input" ref="input" value={this.state.latestCharacter} />
        );
    }
});