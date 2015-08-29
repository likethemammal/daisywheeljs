var React = require('react');
var _ = require('underscore');

module.exports = React.createClass({
	displayName: 'Tabs',

    propTypes: {
        titles: React.PropTypes.arrayOf([
            React.PropTypes.string
        ]).isRequired,
        panes: React.PropTypes.arrayOf([
            React.PropTypes.element
        ]).isRequired
    },
    getInitialState: function() {
        return {
            currentTabIndex: 0
        }
    },
    selectTab: function(index) {
        this.setState({
            currentTabIndex: index
        });
    },
    getTabNavs: function() {
        var currentIndex = this.state.currentTabIndex;
        var selectTabFunc = this.selectTab;
        return _.map(this.props.titles, function(title, index) {
            var activeClass = (index === currentIndex) ? 'active' : '';

            return (
                <div className={"tabNav " + activeClass} key={index} onClick={selectTabFunc.bind(null, index)} onFocus={selectTabFunc.bind(null, index)} tabIndex={index + 1}>
                    {title}
                </div>
            );
        });
    },
    render: function() {
        var navs = this.getTabNavs();
        var currentPane = this.props.panes[this.state.currentTabIndex];

        return (
			<div className="tabs">
                <div className="tabNavs clearfix">
                    {navs}
                </div>
                <div className="tabPane">
                    {currentPane}
                </div>
            </div>
        );
    }
});