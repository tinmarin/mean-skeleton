var gulp 		    = require('gulp');
var sass 		    = require('gulp-sass');
var concat      = require('gulp-concat');
var browserSync = require('browser-sync');
var reload 	  	= browserSync.reload;
var nodemon   	= require('gulp-nodemon');
var prefix 	  	= require('gulp-autoprefixer');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var minifyCSS   = require('gulp-minify-css');
var ngAnnotate  = require('gulp-ng-annotate');

var paths = {
	sass: './client/assets/sass/*.sass'
};
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('browser-sync', ['sass', 'nodemon'], function() {
    browserSync({
        proxy: 'http://localhost:3000',
  		port: 4000,
   		notify: false
    });
});

gulp.task('sass', function () {
    return gulp.src('client/assets/sass/style.sass')
        .pipe(sass({
            includePaths: ['sass'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(minifyCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'server.js',
    watch: ['server.js']
  })
    .on('start', function onStart() {
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      setTimeout(function reload() {
        browserSync.reload({
          stream: false  
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});


gulp.task('minify', ['scripts', 'angular', 'sass']);

gulp.task('scripts', function() {
    gulp.src(['client/assets/js/*.js'])
      .pipe(uglify())
      .pipe(rename('scripts.min.js'))
      .pipe(gulp.dest('build'));
});

gulp.task('angular', function () {
  gulp.src(['client/app/*.js', 'client/app/**/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
    gulp.watch('client/assets/sass/*.sass', ['sass']);
    gulp.watch(['build/*','client/*', 'client/app/**/**/*.js', 'client/app/*.js','client/assets/js/*.js'], reload);
});

gulp.task('build', ['minify']);

gulp.task('default', ['browser-sync', 'watch']);