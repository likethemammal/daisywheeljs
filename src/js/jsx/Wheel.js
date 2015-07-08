var React = require('../react.0.13.3.js');
var Input = require('jsx/Input.js');
var Flower = require('jsx/Flower.js');
var Controls = require('jsx/Controls.js');

module.exports = React.createClass({
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