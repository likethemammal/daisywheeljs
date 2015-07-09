module.exports = function(petals) {
    var styles = document.createElement('style'),
        stylesStr = '',
        radius = 208,
        petalDiameter = 160,
        width = 640,
        height = 640,
        step = (2*Math.PI) / petals,
        angle = -step * 2;

    for (var i = 0; i < petals; i++) {

        var x = Math.round(width/2 + radius * Math.cos(angle) - petalDiameter/2),
            y = Math.round(height/2 + radius * Math.sin(angle) - petalDiameter/2),
            rotation = angle * 180 / Math.PI + 135;

        stylesStr += ['#daisywheel-js .petal:nth-of-type(' + (i + 1) + ') {',
            'top: ' + y + 'px;',
            'left: ' + x + 'px;',
            'transform: rotate(' + rotation + 'deg);',
            '-ms-transform: rotate(' + rotation + 'deg);',
            '-webkit-transform: rotate(' + rotation + 'deg);',
            '} '].join('');

        stylesStr += ['#daisywheel-js .petal:nth-of-type(' + (i + 1) + ') .buttons {',
            'transform: rotate(' + (-rotation) + 'deg);',
            '-ms-transform: rotate(' + (-rotation) + 'deg);',
            '-webkit-transform: rotate(' + (-rotation) + 'deg);',
            '} '].join('');

        angle += step;
    }

    styles.innerHTML = stylesStr;
    document.head.appendChild(styles);
};