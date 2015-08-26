var React = require('react');
var _ = require('underscore');
var controllerSupport = require('../json/controller-support');
var ControllerTableRow = require('./ControllerTableRow');
var EmptyPane = require('./EmptyPane');
var Tabs = require('./Tabs');
var MoreInfo = require('./MoreInfo');

module.exports = React.createClass({
	displayName: 'Troubleshooting',
    propTypes: {
        info: React.PropTypes.string,
        controller: React.PropTypes.string,
        onPopulateMoreInfo: React.PropTypes.func
    },
    render: function() {
        var populateMoreInfo = this.props.onPopulateMoreInfo;
        var titles = ['Windows', 'Linux', 'OSX'];
        var panes = _.map(titles, function(title, index) {
            var os = title.toLowerCase();
            var listOfBrowsers = {};
            var renderedComponent;

            _.map(controllerSupport, function(controller) {
                var browsers = controller[os];

                if (browsers) {
                    _.map(browsers, function(browser, browserName) {
                        listOfBrowsers[browserName] = true;
                    })
                }
            });

            var browserRow = _.map(listOfBrowsers, function(doesExist, browserName) {
                return (
                    <th key={browserName}>{browserName}</th>
                    );
            });

            var rows = _.map(controllerSupport, function(controller, name) {
                var browsers = controller[os];

                if (browsers) {
                    return <ControllerTableRow name={name} browserNames={listOfBrowsers} support={browsers} key={name} moreInfoFunc={populateMoreInfo}/>
                }
            });

            if (!_.isEmpty(listOfBrowsers)) {
                renderedComponent = (
                    <table key={index}>
                        <tr>
                            <td></td>
                            {browserRow}
                            </tr>
                        {rows}
                    </table>
                );
            } else {
                renderedComponent = (<EmptyPane/>);
            }

            return renderedComponent;
        });

        return (
			<div className="troubleshooting">
                <Tabs titles={titles} panes={panes} />
                <MoreInfo info={this.props.info} controller={this.props.controller}/>
            </div>
        );
    }
});