var React = require('../libs/react.0.13.3.js');
var Input = require('./Input.js');
var Flower = require('./Flower.js');
var Controls = require('./Controls.js');

module.exports = React.createClass({
    displayName: "Wheel",
    render: function() {
        return (
            <div id="daisywheel">
                <Input />
                <Flower flux={window.flux}/>
                <Controls />
            </div>
        );
    }
});