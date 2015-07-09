var React = require('../libs/react.0.13.3.js');
var _ = require('../libs/underscore.1.8.3.js');
var Button = require('./Button.js');

module.exports = React.createClass({
    displayName: 'Petal',
    propTypes: {
        symbols: React.PropTypes.array.isRequired,
        selected: React.PropTypes.bool
    },

    render: function() {
        var symbols = this.props.symbols;
        var buttonPositions = ['left', 'top', 'right', 'bottom'];
        var buttons = _.map(buttonPositions, function(position, i) {
            return <Button position={position} symbol={symbols[i]} flux={window.flux} key={i}/>
        });
        var selectedClass = (this.props.selected) ? 'selected': '';

        return (
            <div className={"petal " + selectedClass}>
                <div className="petal-inner">
                    <div className="buttons">
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }
});