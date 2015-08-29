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
                    <table className="troubleshootingTable" key={index}>
                        <tr>
                            <td className="tableEmptySpace"></td>
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
                <p>The <a target="_blank" href="https://w3c.github.io/gamepad/">HTML5 Gamepad API</a> is the cutting-edge web technology that makes DaisywheelJS possible. Because the technology is still very experimental, controller support varies greatly, across controller brand and operating system. You can test your setup at either <a target="_blank" href="http://html5gamepad.com/">http://html5gamepad.com/</a> or with the <a target="_blank" href="http://www.html5rocks.com/en/tutorials/doodles/gamepad/gamepad-tester/tester.html">“HTML5 Rocks” Gamepad tester</a>.</p>
                <p>Below is a table of support for each controller type. There is also more information that will direct you to installation and setup.</p>
                <p><em>**DaisywheelJS is not liable for any potential damage to property caused by any of the drivers or software mentioned. Using gamepads with traditional computing devices is a very young endeavor. There are many less than savory programs out there. Be smart. Do your research.**</em></p>
                <Tabs titles={titles} panes={panes} />
                <MoreInfo info={this.props.info} controller={this.props.controller}/>
                <div className="otherTips">
                    <h4>Other Tips</h4>
                    <p>Why isn't my gamepad showing up&#63;</p>
                    <ul>
                        <li>Is the device plugged in / connected via bluetooth</li>
                        <li>Press some buttons. On some devices, only certain buttons will wake up the gamepad API (the shapes on PS3 controllers, for instance)</li>
                        <li>Close other apps that may be using the gamepad</li>
                        <li>Restart your web browser</li>
                    </ul>
                </div>
            </div>
        );
    }
});