module.exports = {
    populateMoreInfo: function(info, controller) {
        return {
            type: 'POPULATE_MORE_INFO',
            info: info,
            controller: controller
        }
    }
};