//gulpfile.js
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
const imagemin = require('gulp-imagemin');



// Static develop + watching scss/html files
// gulp.task('develop', ['sass'], function() {

//     browserSync.init({
//         server: "./",
//         browser: "google chrome"
//         // browser: "firefoxdeveloperedition"
//         // browser: ["google chrome", "firefoxdeveloperedition"]
//     });

//     // gulp.watch("style.scss", ['sass']);
//     // gulp.watch("style.css").on('change', browserSync.reload);
//     gulp.watch("index.html").on('change', browserSync.reload);
// });



// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("scss/style.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("css/style.css").on('change', browserSync.reload);
});



gulp.task('opti', () =>
    gulp.src('img/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('opti'))
);
