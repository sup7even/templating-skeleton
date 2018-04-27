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
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    nunjucksRender = require('gulp-nunjucks-render'),
    browserSync = require('browser-sync').create(),
    fs = require('fs'),
    replace = require('gulp-string-replace'),
    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json"),
    browserify = require("browserify"),
    source = require('vinyl-source-stream'),
    tsify = require("tsify"),
    read = require('read-data'),
    writeFile = require('write');

    var _resourceDirectory = 'typo3conf/ext/theme/Resources';
/**
 * exports nunjucks template vars and markup
 * to TYPO3 fluid template vars and markup
 */
gulp.task('export-fluid-templates', function() {

    /* delete previous files */
    del([
        'typo3conf/*'
    ]);

    /* convert nunjucks to fluid */
    gulp.src(["src/nunjucks/**/*.html"])
        .pipe(replace(new RegExp('{% include "(.*)" %}', 'g'), function(r, x){
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
        .pipe(gulp.dest(_resourceDirectory +'/Private/'))

    /* generate svg */
    gulp.src('src/img/svg/**/*.svg')
        .pipe(svgMin())
        .pipe(gulp.dest(_resourceDirectory +'/Public/Images/Svg'));

    /* generate scss */
    gulp.src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 4 version'))
        .pipe(cssnano({
            zindex: false
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(_resourceDirectory +'/Public/Css/'))

    /* generate js */
    gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'src/js/**/*.js'
        ])
        .pipe(concat('main.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(_resourceDirectory +'/Public/JavaScript/'))

    /* copy all images */
    gulp.src('src/img/*')
        .pipe(gulp.dest(_resourceDirectory +'/Public/Images/'))

    /* copy all fonts */
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest(_resourceDirectory +'/Public/Fonts/'))
});

/**
 * converts all svg files to an inline svg scss file
 * destination is in src for including in src scss files
 */
gulp.task('inline-svg', function() {
    return gulp.src('src/img/svg/**/*.svg')
        .pipe(svgMin())
        .pipe(gulp.dest('dist/img/svg/'))
        .pipe(inlineSvg())
        .pipe(gulp.dest('src/scss/svg/'));
});

/**
 * compiles, minifies, concatenate all scss files
 * and copies it to dist directory
 */
gulp.task('styles', [ 'styles-styleguide' ], function () {
    return gulp.src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano({
            zindex: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('styles-styleguide', function () {
    return gulp.src('src/scss/styleguide.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('dist/css'))
        .pipe(cssnano({
            zindex: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css'))
});

/**
 * compiles, minifies, concatenate all js files
 * from src and node_modules folder, if needed
 * and copies it to dist directory
 */
gulp.task('scripts', [ 'scripts-styleguide' ], function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'src/js/**/*.js',
        '!src/js/styleguide.js'
    ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-styleguide', function() {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        'src/js/**/*.js',
        '!src/js/main.js'
    ])
        .pipe(concat('styleguide.js'))
        .pipe(gulp.dest('dist/js'))
});

/**
 * newly implemented styleguide typescript
 * @TODO: almost everything ;) not finished yet
 */
gulp.task("typescript", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/typescript/styleguide.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('styleguide.js'))
        .pipe(gulp.dest("dist/js/test/"));
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
                content: JSON.parse(fs.readFileSync('src/data/data.json')),
                devices: JSON.stringify(JSON.parse(fs.readFileSync('src/data/devices.json')))
            },
            path: ['src/nunjucks'],
            envOptions: {
                autoescape: false
            }

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
    gulp.start(
        'config',
        'inline-svg',
        'styles',
        'styles-styleguide',
        'scripts',
        'scripts-styleguide',
        'typescript',
        'templates',
        'images',
        'fonts'
    );
});

/**
 * simple watch task for all scss/js and template files
 */
gulp.task('watch', ['default'], function() {
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/nunjucks/**/*.html', ['templates']);
    gulp.watch('src/data/**/*.json', ['templates']);
    gulp.watch('src/typescript/**/*.ts', ['typescript']);
});

/**
 * simple watch task for typescript only
 */
gulp.task('watch-ts', function() {
    gulp.watch('src/typescript/**/*.ts', ['typescript']);
});

/**
 * using browser sync
 */
gulp.task('serve', ['default'], function () {
    browserSync.init({
        proxy: 'html.vm/template-skeleton/dist/',
        files: ['dist/css/main.min.css', 'dist/js/main.min.js', 'dist/**/*.html'],
        notify: true,
        open: false
    });

    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/nunjucks/**/*.html', ['templates']);
    gulp.watch('src/data/**/*.json', ['templates']);
});

/**
 * reads yaml config and writes several files
 * e.g. scss files or typoscript files
 */
gulp.task('config', function(){
    // read the desired yaml file
    // look for possible options in the yaml file
    read('src/data/config.yaml', function(err, data) {
        // log error to console, if file is missing
        // not not correct yaml
        if (err) {
            return console.log(err);
        }

        // pre defined variables
        var config = data['config'],
            exports,
            type,
            i;

        // loop through the export keys
        // located in the yaml file.
        // in this case breakpoints and containers
        for (exports in config) {
            var entry = config[exports];
            var values = entry['values'];

            // loop through the type in each
            // export loop. in this case
            // it is the scss and constantsts in the
            // first export and the scss in the second
            // breakpoint
            for (type in entry['export']) {
                var _variableName = entry['export'][type].name,
                    _fileName = entry['export'][type].file,
                    _return = [];

                // get the values for the desired export file
                for(i in values) {
                    // parse the i as an integer for math operations
                    i = parseInt(i);

                    // get the line for each value depending on the
                    // export type (scss/typoscript
                    _return.push(writeLn(values[i].key, values[i].value, type));

                    // add the additional line, if the additional key
                    // is set. very specific. dont know if that is a cool way
                    if (typeof entry['export'][type].additional !== 'undefined') {
                        if (typeof values[i + 1] !== 'undefined') {
                            _return.push(writeLn(values[i].key +'-'+ entry['export'][type].additional, parseInt(values[i + 1].value) - 1 +'px', type));
                        }
                    }
                }

                // wrap and join the array with some comments and line breaks
                var content = wrap(joinLines(_return, type), _variableName, type, _fileName);

                // finaly write the desired file to the folder given in the
                // yaml file or log an error to the console if it fails
                writeFile(_fileName, content, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });
});

/**
 * returns the line for the export file
 * active exportable lines are for scss files
 * or typoscript files. each file has different
 * separators. you can add for each type in your
 * export a different separator key, if needed.
 *
 * maybe we should put that in a different class
 * for better usability
 *
 * @param key
 * @param value
 * @param type
 * @return {string}
 */
function writeLn(key, value, type) {
    var separator = {
        'scss': ': ',
        'constantsts': ' = '
    };

    return key + (typeof separator[type] !== 'undefined' ? separator[type] : '') + value;
}

/**
 * this function join the givven arrays with an
 * defined END OF LINE (eol) string. in this case,
 * the scss files need a comma at the end. if no key
 * is given for the type, then nothing will be added.
 *
 * add eol strings for each type you want to join, if needed
 *
 * maybe we should put that in a different class
 * for better usability
 *
 * @param object
 * @param type
 */
function joinLines(object, type) {
    var eol = {
        'scss': ',',
    };

    // simply add a tab for better readability to each line.
    for(k in object) {
        object[k] = '\t'+ object[k];
    }

    return object.join((typeof eol[type] !== 'undefined' ? eol[type] : '') +'\n');
}

/**
 * wrap the string you get with specific variable
 * names from the yaml file. each type can have
 * different variableName write styles. depends
 * on what your file should be (scss, typoscript or
 * maybe a php file)
 *
 * even a end string could be set in the variables for
 * each type.
 *
 * the whole string is wrapped with comments for better
 * readability and understandability
 *
 * @param string
 * @param variableName
 * @param type
 * @param fileName
 * @return {string}
 */
function wrap(string, variableName, type, fileName) {
    var wrap = {
        'scss': {
            'start': '$'+ variableName +': (\n',
            'end': '\n);',
        },
        'constantsts': {
            'start': variableName +' {\n',
            'end': '\n}',
        },
    }

    var comment  = '// ' + fileName + ', created with gulp task and yaml config\n';
        comment += '// created at: ' + new Date().toString() +'\n';

    return comment + (typeof wrap[type] !== undefined ? wrap[type]['start'] : '') + string + (typeof wrap[type] !== undefined ? wrap[type]['end'] : '');
}