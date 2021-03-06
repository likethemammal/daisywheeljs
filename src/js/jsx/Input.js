var React = require('react');
var ReactDOM = require('react-dom');
var Fluxxor = require('fluxxor');
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
        var input = ReactDOM.findDOMNode(this.refs.input);
        Utils.setCursor(input, this.state.cursor);
        input.scrollLeft = input.scrollWidth;
        input.focus();
    },

    componentWillMount: function() {
        //Has to be on mousedown because of possiblity of text selection
        document.addEventListener('mousedown', this.onInputMouseDown);
    },

    componentWillUnmount: function() {
        document.removeEventListener('mousedown', this.onInputMouseDown);
    },

    onInputChange: function() {
        var inputEl = this.refs.input;
        var value = inputEl.value;
        flux.actions.setInputValue(value);
        this.onInputMouseDown();
    },

    onInputMouseDown: function() {
        var inputEl = this.refs.input;
        flux.actions.setInputCursor(Utils.getCursor(inputEl));
    },

    render: function() {
        var inputValue = this.state.value;

        return (
            <div id='daisywheel-input-container'>
                <textarea ref="input" id='daisywheel-input' value={inputValue} onChange={this.onInputChange}></textarea>
            </div>
        );
    }
});