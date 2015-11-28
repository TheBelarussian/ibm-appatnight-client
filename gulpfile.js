'use strict';

var gulp 		  	= require('gulp'),
	concat 		  	= require('gulp-concat'),
	sourcemaps 		= require('gulp-sourcemaps'),
	jshint			= require('gulp-jshint'),
	stylish			= require('jshint-stylish'),
	uglify 		 	= require('gulp-uglify'),
	ngAnnotate 		= require('gulp-ng-annotate'),
	bower 		  	= require('gulp-bower'),
	connect 	  	= require('gulp-connect'),
	minifyHTML 		= require('gulp-minify-html'),
	gulpif 		  	= require('gulp-if'),
	sass        	= require('gulp-sass'),
	notify 			= require('gulp-notify'),
	plumber			= require('gulp-plumber'),
	fileinclude 	= require('gulp-file-include');

var debug = false;

var onError = function(err) {
        notify.onError({
            title:    "Gulp",
            subtitle: "Failure!",
            message:  "Error: <%= error.message %>",
            sound:    "Beep"
        })(err);

        this.emit('end');
 };

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./dist/assets/libs'));
});


gulp.task('js', function () {
  gulp.src(['./src/app/*.js', './src/app/**/controller.js', './src/app/**/*.js'])
  	.pipe(gulpif(debug, sourcemaps.init()))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(plumber({errorHandler: onError}))
		.pipe(concat('app.js'))
		.pipe(ngAnnotate())
		.pipe(gulpif(!debug, uglify()))
    .pipe(gulpif(debug, sourcemaps.write()))
    .pipe(gulp.dest('./dist/app/'))
    .pipe(connect.reload());
});


gulp.task('html', function () {
  var opts = {
  	empty: true,
    spare: true
  };

  gulp.src(['./src/app/**/*.html', './src/*.html'])
  	.pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
	   }))
    .pipe(gulpif(!debug, minifyHTML(opts)))
    .pipe(gulp.dest('./dist/'))
    .pipe(connect.reload());
});


gulp.task('sass', function () {
  var opts = {
    outputStyle: "compressed"
  };

  var debugOpts = {
    outputStyle: "expanded"
  };

  gulp.src(['./src/assets/sass/**/*.scss', './src/app/**/*.css', './src/app/**/*.scss'])
	.pipe(plumber({errorHandler: onError}))
    .pipe(gulpif(debug, sass(debugOpts).on('error', sass.logError)))
    .pipe(gulpif(!debug, sass(opts).on('error', sass.logError)))
	.pipe(concat('style.css'))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(connect.reload());
});


gulp.task('assets', function () {
  gulp.src(['./src/assets/**', '!./src/assets/sass{,/**}'])
    .pipe(gulp.dest('./dist/assets'))
    .pipe(connect.reload());
});


gulp.task('watch', ['js', 'sass', 'html', 'assets'], function () {
  gulp.watch(['./src/app/*.js', './src/app/**/*.js'], ['js']);
  gulp.watch(['./src/assets/sass/**/*.scss', './src/assets/sass/*.scss', './src/app/**/*.css', './src/app/**/*.scss'], ['sass']);
  gulp.watch(['./src/*.html', './src/**/*.html'], ['html']);
  gulp.watch(['./src/assets/**'], ['assets']);
});


gulp.task('connect', function() {
  connect.server({
    root: './dist',
    livereload: true,
    port: 8888
  });
});

gulp.task('setdebug', function() {
	debug = true;
});

gulp.task('debug', ['setdebug', 'default'], function() {

});

gulp.task('build', ['bower', 'js', 'sass', 'html', 'assets'], function() {

});

gulp.task('default', ['build', 'connect', 'watch'], function() {

});
