var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var path         = require('path');
var watch        = require('gulp-watch');
var del          = require('del');
var gulpSequence = require('gulp-sequence');
var notify       = require('gulp-notify');

var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var watchify    = require('watchify');
var exorcist    = require('exorcist');
var browserify  = require('browserify');


/**
 * Error handler
 */
function handleErrors (errorObject, callback) {
  notify.onError(errorObject.toString().split(': ').join(':\n')).apply(this, arguments)
  // Keep gulp from hanging on this task
  if (typeof this.emit === 'function') this.emit('end')
}

/**
 * Static file task - copy html and json files
 */
function staticTask () {
    return gulp
        .src(['src/**/*.{html,json,min.js}'])
        .pipe(gulp.dest('public'))
        .pipe(browserSync.stream());
}

/**
 * CSS task - compile sass into css
 */
function cssTask () {
    return gulp.src('src/stylesheets/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            'indentedSyntax': false // scss
        }))
        .on('error', handleErrors)
        .pipe(autoprefixer({
            'browsers': ['last 3 version']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/stylesheets/'))
        .pipe(browserSync.stream())
}

function browserSyncTask () {
    browserSync.init({
        'server': {
            'baseDir': 'public'
        }
    });
}


/*
 * JS
 */
watchify.args.debug = true;

function jsTask () {
    return bundler.bundle()
        .on('error', handleErrors)
        .pipe(exorcist('public/javascripts/shared.js.map'))
        .pipe(source('shared.js'))
        .pipe(gulp.dest('public/javascripts'))
        .pipe(browserSync.stream({once: true}));
}


gulp.task('static', staticTask);
gulp.task('css', cssTask);
gulp.task('js', jsTask);
gulp.task('browserSync', browserSyncTask);

gulp.task('watch', ['browserSync'], function () {
    watch('src/stylesheets/**/*.scss', cssTask);
    watch('src/**/*.{html,json}', staticTask);
});

gulp.task('clean', function cleanTask (cb) {
    del('public/**/*').then(function (paths) {
        cb()
    })
});


gulp.task('default', function defaultTask (cb) {
    // Watch mode
    bundler = watchify(browserify('src/javascripts/shared.js', watchify.args));

    bundler.transform(babelify.configure({
        sourceMapRelative: 'src/javascripts'
    }));

    // On updates recompile
    bundler.on('update', jsTask);

    gulpSequence('clean', 'css', 'js', 'static', 'watch', cb)
});

gulp.task('production', function productionTask (cb) {
    // Build mode
    bundler = browserify('src/javascripts/shared.js', watchify.args);

    bundler.transform(babelify.configure({
        sourceMapRelative: 'src/javascripts'
    }));

    gulpSequence('clean', 'css', 'js', 'static', cb)
});
