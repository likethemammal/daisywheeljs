var React = require('../libs/react.0.13.3.js');
var _ = require('../libs/underscore.1.8.3.js');
var Fluxxor = require('../libs/fluxxor.1.6.0.js');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Petal = require('./Petal.js');

module.exports = React.createClass({
    displayName: 'Flower',
    mixins: [FluxMixin, StoreWatchMixin(['SymbolsStore', 'WheelStore'])],

    getStateFromFlux: function() {
        var symbolState = this.getFlux().store('SymbolsStore').getState();
        var wheelState = this.getFlux().store('WheelStore').getState();
        var currentSet = symbolState.symbolSets[symbolState.selectedSet];

        return {
            symbolSet: currentSet,
            numOfPetals: wheelState.numOfPetals,
            selectedPetal: wheelState.selectedPetal
        };
    },

    render: function() {
        var symbolSet = this.state.symbolSet;
        var selectedPetal = this.state.selectedPetal;

        var petals = _.times(this.state.numOfPetals, function(n) {
            var from = n*4;
            var symbols = symbolSet.slice(from, from + 4);
            var isSelected = selectedPetal === n;

            return <Petal symbols={symbols} selected={isSelected} key={n}/>
        });

        return (
            <div id="daisywheel-flower">
                {petals}
            </div>
        );
    }
});