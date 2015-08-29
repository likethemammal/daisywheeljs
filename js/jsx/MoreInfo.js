var React = require('react');

module.exports = React.createClass({
	displayName: 'MoreInfo',
    propTypes: {
        info: React.PropTypes.string,
        controller: React.PropTypes.string
    },
    render: function() {
        var info = this.props.info || 'No extra info';
        if (info === info + '') {
            info = (<p>{info}</p>);
        }

        return (
			<div className={"moreInfo "}>
                <h4>More Info</h4>
                {this.props.controller}
                {info}
            </div>
        );
    }
});