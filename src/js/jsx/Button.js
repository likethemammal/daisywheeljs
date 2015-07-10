var React = require('react');
var _ = require('underscore');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    displayName: "Button",
    mixins: [FluxMixin, StoreWatchMixin('SymbolsStore')],

    propTypes: {
        position: React.PropTypes.string.isRequired,
        symbol: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.shape({
                font: React.PropTypes.string.isRequired,
                symbol: React.PropTypes.string.isRequired
            })
        ])
    },

    getStateFromFlux: function() {
        var symbolState = this.getFlux().store('SymbolsStore').getState();

        return {
            selectedSymbol: symbolState.selectedSymbol
        };
    },

    render: function() {
        var position = this.props.position;
        var symbol = this.props.symbol;
        var opacity;
        var styles;
        var symbolContent;
        var selectedClass = (this.state.selectedSymbol === symbol) ? 'pressed' : '';

        if (symbol) {
            opacity = 1;
        } else {
            symbol = '';
            opacity = 0.5;
        }

        styles = {
            fontFamily: symbol.font || '',
            opacity: opacity
        };
        symbolContent = symbol.symbol || symbol;

        return (
            <div className={'button button-' + position + ' ' + selectedClass} style={styles}>
                {symbolContent}
            </div>
        );
    }
});