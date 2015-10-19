var gulp = require("gulp");
var sass = require("gulp-sass");
var livereload = require("gulp-livereload");
var through = require("through2");

gulp.task('sass', function () {
  gulp.src('./_sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
    // .pipe(livereload());
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./_sass/**/*.scss', ['sass']);

  // Only notify livereload once the jekyll-generated output has changed.
  gulp.watch('./_site/**/*.css').on('change', livereload.changed);
});