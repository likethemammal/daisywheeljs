var React = require('react');
var Troubleshooting = require('./jsx/Troubleshooting');
var Daisywheel = require('daisywheel');

var Redux = require('redux');
var ReactRedux = require('react-redux');
var createStore = Redux.createStore;
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;
var actions = require('./actions');

// Connected Component:
var App = connect(
    mapStateToProps,
    mapDispatchToProps
)(Troubleshooting);

function mapStateToProps(state)  {
    return {
        info: state.info,
        controller: state.controller
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onPopulateMoreInfo: function(info, controller) {
            dispatch(actions.populateMoreInfo(info, controller))
        }
    };
}

function infoStore(state, action) {
    if (typeof state === 'undefined') {
        state = {
            info: "Click 'Support' for any controller to see more info...",
            controller: ''
        };
    } else if (action) {
        state = {
            info: action.info,
            controller: action.controller
        }
    }

    return state;
}