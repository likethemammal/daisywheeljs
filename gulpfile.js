var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var path = require('path');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');

var lessFiles = [
    'src/less/mixins.less',
    'src/less/daisywheel.less'
];

var paths = {
    HTML: 'src/example/index.html',
    ALL: ['src/js/*.js', 'src/js/**/*.js', 'src/example/index.html'],
    JS: ['src/js/*.js', 'src/js/**/*.js'],
    MINIFIED_OUT: 'daisywheel.min.js',
    DEST_SRC: 'dist/src',
    DEST_BUILD: 'dist/build',
    DEST: 'dist',
    OUT: 'daisywheel.js',
    ENTRY_POINT: './src/js/main.js'
};

gulp.task('copy', function(){
    gulp.src(paths.HTML)
        .pipe(gulp.dest(paths.DEST));
});

gulp.task('watch', function() {
    gulp.watch(paths.HTML, ['copy']);

    var watcher  = watchify(browserify({
        entries: [paths.ENTRY_POINT],
        transform: [reactify],
        debug: true,
        cache: {}, packageCache: {}, fullPaths: true
    }));

    return watcher.on('update', function () {
        watcher.bundle()
            .pipe(source(paths.OUT))
            .pipe(gulp.dest(paths.DEST_SRC));
        console.log('Updated');
    })
        .bundle()
        .pipe(source(paths.OUT))
        .pipe(gulp.dest(paths.DEST_SRC));
});

gulp.task('default', ['watch', 'css']);

gulp.task('build', function(){
    browserify({
        entries: [paths.ENTRY_POINT],
        transform: [reactify]
    })
        .bundle()
        .pipe(source(paths.MINIFIED_OUT))
        .pipe(streamify(uglify(paths.MINIFIED_OUT)))
        .pipe(gulp.dest(paths.DEST_BUILD));

    gulp.start('css');
});

gulp.task('replaceHTML', function(){
    gulp.src(paths.HTML)
        .pipe(htmlreplace({
            'js': 'build/' + paths.MINIFIED_OUT
        }))
        .pipe(gulp.dest(paths.DEST));
});

gulp.task('production', ['replaceHTML', 'build']);


gulp.task('css', function () {
    return gulp.src(lessFiles)
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(rename('daisywheel.min.css'))
        .pipe(gulp.dest(paths.DEST_BUILD));

});