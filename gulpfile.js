var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var path = require('path');

var lessFiles = [
    'less/mixins.less',
    'less/daisywheel.less'
];

gulp.task('default', ['uglify', 'css']);

gulp.task('uglify', function() {
    return gulp.src('daisywheel.js')
        .pipe(uglify())
        .pipe(rename('daisywheel.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function () {
    return gulp.src(lessFiles)
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(rename('daisywheel.min.css'))
        .pipe(gulp.dest('dist'));

});