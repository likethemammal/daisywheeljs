var React = require('react');

module.exports = React.createClass({
	displayName: 'ControllerTableCell',
    propTypes: {
        browser: React.PropTypes.shape({
            support: React.PropTypes.oneOf([
                'supported',
                'untested',
                'not-supported'
            ]).isRequired,
            more: React.PropTypes.string,
            versions: React.PropTypes.array
        }).isRequired,
        browserName: React.PropTypes.string
    },
    render: function() {
        var supportText = '';
        var browser = this.props.browser;
        var support = browser.support;
        var supported;
        var versions;

        switch (support) {
            case 'supported':
                supportText = 'Support';
                versions = browser.versions + '';
                break;
            case 'untested':
                supportText = 'TBD';
                break;
            case 'not-supported':
                supportText = 'No Support';
                break;
        }

        return (
			<td className={"controllerTableCell " + support} title={versions}>
                {browser}
            </td>
        );
    }
});