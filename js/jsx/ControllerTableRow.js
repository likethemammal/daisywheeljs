var React = require('react');
var _ = require('underscore');
var ControllerTableCell = require('./ControllerTableCell');

module.exports = React.createClass({
	displayName: 'ControllerTableRow',
    propTypes: {
        browserNames: React.PropTypes.object.isRequired,
        name: React.PropTypes.string.isRequired,
        support: React.PropTypes.object.isRequired,
        moreInfoFunc: React.PropTypes.func.isRequired
    },
    render: function() {
        var support = this.props.support;
        var moreInfoFunc = this.props.moreInfoFunc;
        var name = this.props.name;
        var cells = _.map(this.props.browserNames, function(doesExist, browserName) {
            var browser = support[browserName] || {
                support: 'untested'
            };

            return (<ControllerTableCell controllerName={name} moreInfoFunc={moreInfoFunc} browserName={browserName} browser={browser} key={browserName}/>);
        });

        return (
			<tr className="controllerTableRow">
                <td className="controllerTableName">{this.props.name}</td>
                {cells}
            </tr>
        );
    }
});