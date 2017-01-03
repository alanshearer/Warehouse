const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');

gulp.task('clean', function () {
  return del(['public/app/**/*', 'public/common/**/*', 'public/configuration/**/*', 'public/content/**/*']);
});

gulp.task('compile:noclean', [], function () {
  return gulp
    .src(['angular/references/*.ts', 'angular/configuration/*.ts', 'angular/common/**/**/*.ts', 'angular/app/**/**/*.ts'], {base:"angular"})
    .pipe(typescript())
    .pipe(gulp.dest('public'));
});

gulp.task('compile', ['clean', 'compile:noclean']);

gulp.task('copy:assets', [], function() {
  return gulp.src(['angular/common/directives/templates/**/*.html', 'angular/app/backoffice/**/*.html', 'angular/*.html'], {base:"angular"})
    .pipe(gulp.dest('public'));
});

gulp.task('copy:contents', [], function() {
  return gulp.src(['angular/content/*.json', 'angular/content/**/*', 'angular/common/services/caching/plugins/**/*'], {base:"angular"})
    .pipe(gulp.dest('public'));
});

gulp.task('copy', ['copy:contents', 'copy:assets']);
gulp.task('build', ['compile', 'copy']);
gulp.task('default', ['build']);

/*
var minify = require('gulp-minify');
gulp.task('compress', function() {
  gulp.src('lib/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist'))
});
*/