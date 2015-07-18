var React = require('react');
var _ = require('underscore');
var Fluxxor = require('fluxxor');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;
var Petal = require('./Petal.js');
var SetupFlowerStyles = require('../units/SetupFlowerStyles.js');

module.exports = React.createClass({
    displayName: 'Flower',
    mixins: [FluxMixin, StoreWatchMixin('SymbolsStore', 'WheelStore')],

    getStateFromFlux: function() {
        var symbolState = this.getFlux().store('SymbolsStore').getState();
        var wheelState = this.getFlux().store('WheelStore').getState();
        var currentSet = symbolState.symbolSets[symbolState.selectedSetIndex];

        return {
            symbolSet: currentSet,
            numOfPetals: wheelState.numOfPetals,
            selectedPetal: wheelState.selectedPetal
        };
    },

    componentDidMount: function() {
        SetupFlowerStyles(this.state.numOfPetals);
    },

    render: function() {
        var symbolSet = this.state.symbolSet;
        var selectedPetal = this.state.selectedPetal;

        var petals = _.times(this.state.numOfPetals, function(n) {
            var from = n*4;
            var symbols = symbolSet.slice(from, from + 4);
            var isSelected = selectedPetal === n + 1;

            return <Petal symbols={symbols} selected={isSelected} key={n}/>
        });

        return (
            <div id="daisywheel-flower">
                {petals}
            </div>
        );
    }
});