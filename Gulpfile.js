var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('build', function() {
  gulp.src('client/app.js')
    .pipe(browserify({
      insertGlobals: true,
    }))
    .pipe(gulp.dest('client/assets/'));
});

gulp.task('watch', function() {
  gulp.watch('client/**/*.js', ['build']);
});
