const gulp = require('gulp');
const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const autoprefixer = require('gulp-autoprefixer');
const minifyCSS = require('gulp-minify-css');
const uglifyCSS = require('gulp-uglifycss');
const minifyHTML = require('gulp-minify-html');
const rename = require('gulp-rename');

gulp.task('build-js', () => {
  gulp.src('client/app.js')
    .pipe(babel({presets: ['es2015']}))
    .pipe(browserify({ insertGlobals: true }))
    .pipe(gulp.dest('client/public/scripts'));
});

gulp.task('build-css', () => {
  gulp.src('client/assets/**/*.css')
    .pipe(autoprefixer())
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
