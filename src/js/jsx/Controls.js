var React = require('../libs/react.0.13.3.js');
var _ = require('../libs/underscore.1.8.3.js');
var Fluxxor = require('../libs/fluxxor.1.6.0.js');
var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

module.exports = React.createClass({
    displayName: 'Controls',
    mixins: [FluxMixin, StoreWatchMixin('ControlsStore')],

    uiElements: [
        'left-bumper',
        'left-analog',
        'right-bumper',
        'left-trigger',
        'right-trigger'
    ],

    getStateFromFlux: function() {
        var controlsState = this.getFlux().store('ControlsStore').getState();

        return {
            uiLabels: controlsState
        };
    },

    render: function() {
        var uiLabels = this.state.uiLabels;
        var elements = _.map(this.uiElements, function(element, i) {
            var label = uiLabels[element];

            return (
                <div id={"daisywheel-" + element + "-ui"} key={i}>
                    <div className="control-ui cf">
                        <div className="control-ui-icon"></div>
                        <div className="control-ui-label" title={label}>
                            {label}
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div id="daisywheel-controls-ui">
                {elements}
            </div>
        );
    }
});