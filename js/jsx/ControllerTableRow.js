var React = require('react');
var ControllerTableCell = require('./ControllerTableCell');

module.exports = React.createClass({
	displayName: 'ControllerTableRow',
    propTypes: {
        browserNames: React.PropTypes.object.isRequired,
        name: React.PropTypes.string.isRequired,
        support: React.PropTypes.object.isRequired
    },
    render: function() {
        var support = this.props.support;
        var cells = _.map(this.props.browserNames, function(doesExist, browserName) {
            var browser = support[browserName] || {
                support: 'untested'
            };

            return (<ControllerTableCell browserName={browserName} browser={browser} key={browserName}/>);
        });

        return (
			<tr className="controllerTableRow">
                <td>{this.props.name}</td>
                {cells}
            </tr>
        );
    }
});