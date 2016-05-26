var gulp = require('gulp'),
    mocha = require('gulp-mocha-phantomjs'),
    uglify = require('gulp-uglify');

gulp.task('test-jquery', function() {
  return gulp.src('./test/tests.html')
    .pipe(mocha());
});

gulp.task('test-zepto', function() {
  return gulp.src('./test/tests-zepto.html')
    .pipe(mocha());
});

gulp.task('test',['test-jquery', 'test-zepto']);

gulp.task('default', function() {
  return gulp.src('newPlugin.jquery.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
