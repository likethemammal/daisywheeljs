var gulp = require('gulp');
var rename = require('gulp-rename');
var less = require('gulp-less');
var path = require('path');
var react = require('gulp-react');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var uglifyify = require('uglifyify');
var reactify = require('reactify');

var lessFiles = [
    'src/less/mixins.less',
    'src/less/daisywheel.less'
];

var paths = {
    DIST: 'dist',
    MINIFIED_OUT: 'daisywheel.min.js',
    OUT: 'daisywheel.js',
    MAIN: './src/js/main.js'
};

gulp.task('watch', function() {
    gulp.start('build-dev');
    gulp.start('css');

    //watch the less directory run the css task
    watch('src/less/**/*.less', function () {
        gulp.start('css');
    });
    //watch the js directory to run babel
    watch('src/js/**/*.js', function () {
        gulp.start('build-dev');
    });
});

gulp.task('build', function(){
    browserify({
        entries: [paths.MAIN],
        transform: [reactify],
        standalone: 'Daisywheel'
    })
        .bundle()
        .pipe(source(paths.OUT))
        .pipe(gulp.dest(paths.DIST));

    gulp.start('build-dev');
    gulp.start('css');
});

gulp.task('build-dev', function(){
    browserify({
        entries: [paths.MAIN],
        transform: [reactify, uglifyify],
        standalone: 'Daisywheel',
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    })
        .bundle()
        .pipe(source(paths.MINIFIED_OUT))
        .pipe(gulp.dest(paths.DIST));
});

gulp.task('css', function () {
    return gulp.src(lessFiles)
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(rename('daisywheel.min.css'))
        .pipe(gulp.dest(paths.DIST));
});