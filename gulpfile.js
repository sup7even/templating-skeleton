var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    inlineSvg = require("gulp-inline-svg"),
    svgMin = require('gulp-svgmin'),
    del = require('del');
    sourcemaps = require('gulp-sourcemaps');
    nunjucksRender = require('gulp-nunjucks-render');
    browserSync = require('browser-sync').create();
    fs = require('fs');
    replace = require('gulp-string-replace');


gulp.task('export-fluid-templates', function() {
    gulp.src(["src/nunjucks/**/*.html"])
        .pipe(replace(new RegExp('{% include "partials\\/(.*)" %}', 'g'), function(r, x){
            return '<f:render partial="'+ x +'" />';
        }))
        .pipe(replace(new RegExp('{% block (.*) %}{% endblock %}', 'g'), function(r, x){
            return '<f:render section="'+ x +'" />';
        }))
        .pipe(replace(new RegExp('{% extends "(.*)" %}', 'g'), function(r, x){
             return '<f:layout name="'+ x +'" />';
        }))
        .pipe(replace(new RegExp('{% block (.*) %}', 'g'), function(r, x){
             return '<f:section name="'+ x +'">';
        }))
        .pipe(replace(new RegExp('{% endblock %}', 'g'), function(r, x){
             return '</f:section>';
        }))
        .pipe(gulp.dest('typo3conf/ext/theme/Resources/Private/'))
});


/**
 * converts all svg files to an inline svg scss file
 * destination is in src for including in src scss files
 */
gulp.task('inline-svg', function() {
    return gulp.src('src/img/**/*.svg')
        .pipe(svgMin())
        .pipe(inlineSvg())
        .pipe(gulp.dest('src/scss/svg/'));
});

/**
 * compiles, minifies, concatenate all scss files
 * and copies it to dist directory
 */
gulp.task('styles', function () {
    return gulp.src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

/**
 * compiles, minifies, concatenate all js files
 * from src and node_modules folder, if needed
 * and copies it to dist directory
 */
gulp.task('scripts', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'src/js/**/*.js'
    ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

/**
 * renders all html templates with nunjucks
 * and saves it to dist folder
 */
gulp.task('templates', function() {
    // Gets .html and .nunjucks files in pages
    return gulp.src('src/nunjucks/Templates/Page/**/*.html')
        .pipe(nunjucksRender({
            data: {
                content: JSON.parse(fs.readFileSync('src/data/data.json'))
            },
            path: ['src/nunjucks']
        }))
        .pipe(gulp.dest('dist/'))
});

/**
 * copies all images to dist folder
 */
gulp.task('images', function () {
    gulp.src('src/img/**/*')
        .pipe(gulp.dest('dist/img/'));
});

/**
 * copies all fonts to dist folder
 */
gulp.task('fonts', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'));
});

/**
 * cleans up the dist folder before re-compiling
 * every changes in css files, html files or js files
 * are lost!
 */
gulp.task('clean', function() {
    return del([
        'dist/*',
        'src/scss/svg/*',
        'typo3conf/*'
    ]);
});

/**
 * default task - use for initial compiling
 */
gulp.task('default', ['clean'], function() {
    gulp.start('inline-svg', 'styles', 'scripts', 'templates', 'images', 'fonts');
});

/**
 * simple watch task for all scss/js and template files
 */
gulp.task('watch', ['default'], function() {
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/nunjucks/**/*.html', ['templates']);
    gulp.watch('src/data/**/*.json', ['templates']);
});

/**
 * using browser sync
 */
gulp.task('serve', ['default'], function () {
    browserSync.init({
        proxy: 'html.vm/template-skeleton/dist/',
        files: ['dist/css/main.min.css', 'dist/js/main.min.js', 'dist/index.html'],
        notify: true,
        open: false
    });

    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/nunjucks/**/*.html', ['templates']);
    gulp.watch('src/data/**/*.json', ['templates']);
});