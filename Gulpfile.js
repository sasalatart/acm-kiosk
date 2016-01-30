var gulp = require('gulp');
var browserify = require('gulp-browserify');
var minifyCSS = require('gulp-minify-css');
var uglifyCSS = require('gulp-uglifycss');
var minifyHTML = require('gulp-minify-html');
var rename = require('gulp-rename');

gulp.task('build-js', () => {
  gulp.src('client/app.js')
    .pipe(browserify({ insertGlobals: true }))
    .pipe(gulp.dest('client/public/scripts'));
});

gulp.task('build-css', () => {
  gulp.src('client/assets/**/*.css')
    .pipe(minifyCSS({ compatibility: 'ie8' }))
    .pipe(uglifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('client/public'));
});

gulp.task('build-html', () => {
  gulp.src('client/templates/**/*.html')
    .pipe(minifyHTML({ empty: true, quotes: true }))
    .pipe(gulp.dest('client/public'));
});

gulp.task('move-images', () => {
  gulp.src('client/assets/images/**/*')
    .pipe(gulp.dest('client/public/images'));
});

gulp.task('build', ['build-js', 'build-css', 'build-html', 'move-images']);

gulp.task('watch', () => {
  gulp.watch('client/**/*.js', ['build-js']);
  gulp.watch('client/**/*.css', ['build-css']);
  gulp.watch('client/**/*.html', ['build-html']);
  gulp.watch('client/assets/images/*', ['move-images']);
});
