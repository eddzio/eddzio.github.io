var gulp = require('gulp');
  	sass = require('gulp-sass');
//optimization
    minifycss = require('gulp-clean-css');
    uglify  = require('gulp-uglify'),
    imagemin = require('gulp-imagemin');
    useref    = require('gulp-useref');    
    gulpif    = require('gulp-if'),
    htmlmin = require('gulp-htmlmin');
    
//tools
    cache = require('gulp-cache');
    del = require('del');
    runSequence = require('run-sequence');
//network
    browserSync = require('browser-sync');
    connect = require('gulp-connect-php');



gulp.task('minify:html', function() {
  return gulp.src('dist/**.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});


// compile sass
gulp.task('sass', function(){
  return gulp.src('scss/style.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('css'))
});

/// PHP SERVER DIST
gulp.task('connectdist', function() {
    connect.server({ base: './dist', port: 8010, keepalive: true, tunnel: true});
});

/// PHP SERVER .
gulp.task('connectmain', function() {
    connect.server({ base: '.', port: 8000, keepalive: true});
});

// minify css
gulp.task('minifycss', function() {
  return gulp.src('css/style.css')
  .pipe(minifier())
  .pipe(gulp.dest('dist'))
})


// concatenator
gulp.task('dist', function () {
    return gulp.src('*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifycss()))
        .pipe(gulp.dest('dist'));
});

//optimize images
gulp.task('optimizeimages', function(){
  return gulp.src('dist/assets/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/assets'))
});

//copy files
gulp.task('copyfiles', function() {
	return gulp.src([
		'favicon.png',
		'mandrillcode.php',
    'mandrill-api-php/**',
		'assets/**',
		'fonts/**',
		'logos/**',
		'partners/*.svg',
		'partners/*.png', 
		'font-awesome/css/font-awesome.min.css'
	], {base: '.'})
	  .pipe(gulp.dest('dist'));
});

//clean dist
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

//clear cache
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})


// sequencer
gulp.task('fire', function(callback) {
  runSequence(['clean:dist','dist','copyfiles'],['optimizeimages'],'minify:html', 'connectdist', callback);
});


///// development environment
// PHP Server + watching scss/html files
gulp.task('develop', ['sass'], function() {

    connect.server({}, function (){
    browserSync({
      proxy: '127.0.0.1:8000',
      tunnel: true,
    });
  });

    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("css/style.css", browserSync.reload);
    gulp.watch("*.php").on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
});


// test dist
gulp.task('testdist', function() {

    connect.server({}, function (){
    browserSync({
      proxy: '127.0.0.1:8000',
      tunnel: true,
    });
  });
});


