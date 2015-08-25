var React = require('react');
var _ = require('underscore');
var controllerSupport = require('../json/controller-support');
var ControllerTableRow = require('./ControllerTableRow');
var EmptyPane = require('./EmptyPane');
var Tabs = require('./Tabs');

module.exports = React.createClass({
	displayName: 'Troubleshooting',
    render: function() {
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
                    return <ControllerTableRow name={name} browserNames={listOfBrowsers} support={controller} key={name}/>
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
            </div>
        );
    }
});