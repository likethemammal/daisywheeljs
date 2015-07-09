var React = require('../libs/react.0.13.3.js');
var Fluxxor = require('../libs/fluxxor.1.6.0.js');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Utils = require('../Utils.js');

module.exports = React.createClass({
    displayName: "Input",
    mixins: [FluxMixin, StoreWatchMixin('InputStore')],

    getStateFromFlux: function() {
        var inputState = this.getFlux().store('InputStore').getState();

        return {
            cursor: inputState.cursor,
            value: inputState.value
        };
    },

    componentDidUpdate: function() {
        var input = this.refs.input.getDOMNode();
        Utils.setCursor(input, this.state.cursor);
        input.scrollLeft = input.scrollWidth;
    },

    render: function() {
        var inputValue = this.state.value;

        return (
            <div id='daisywheel-input-container'>
                <input ref="input" id='daisywheel-input' value={inputValue} type="text"/>
            </div>
        );
    }
});