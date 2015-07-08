var React = require('../react.0.13.3.js');
var _ = require('../libs/underscore.1.8.3.js');
var Fluxxor = require('../libs/fluxxor.1.6.0.js');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    mixins: [FluxMixin, StoreWatchMixin(['SymbolsStore'])],

    propTypes: {
        position: React.PropTypes.string.isRequired,
        symbol: React.PropTypes.object
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
            <div className={'button button-' + position + ' ' + selectedClass} styles={styles}>
                {symbolContent}
            </div>
        );
    }
});