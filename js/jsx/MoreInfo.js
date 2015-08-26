var React = require('react');

module.exports = React.createClass({
	displayName: 'MoreInfo',
    propTypes: {
        info: React.PropTypes.string,
        controller: React.PropTypes.string
    },
    render: function() {
        var info = this.props.info || 'No extra info';
        var html = {
            __html: info
        };
        return (
			<div className="moreInfo">
                {this.props.controller}
                {info}
            </div>
        );
    }
});