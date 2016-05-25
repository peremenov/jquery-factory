var gulp = require('gulp'),
    qunit = require('gulp-qunit'),
    uglify = require('gulp-uglify');

gulp.task('test', function() {
  return gulp.src('./test/tests.html')
    .pipe(qunit());
});

gulp.task('default', [ 'test' ], function() {
  return gulp.src('newPlugin.jquery.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
