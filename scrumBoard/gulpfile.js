var gulp = require('gulp'),
    del = require('del'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    prefix = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('vinyl-buffer'),
    LiveServer = require('gulp-live-server');

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    vendorCSS: [
        '../bower_components/bootstrap/dist/css/bootstrap.min.css',
        // 'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
        '../bower_components/font-awesome/css/font-awesome.min.css',
        '../bower_components/toastr/toastr.min.css'
    ],
    vendorJS: [
        //'node_modules/react/dist/react.js',
        //'node_modules/react-dom/dist/react-dom.js',
        //'node_modules/react-router/umd/ReactRouter.js',
        //'bower_components/alt/dist/alt.min.js',
        '../bower_components/jquery/dist/jquery.min.js',
        '../bower_components/bootstrap/dist/js/bootstrap.min.js',
        //'bower_components/d3/d3.min.js',
        '../bower_components/lodash/dist/lodash.min.js',
        '../bower_components/ramda/dist/ramda.min.js',
        '../bower_components/rxjs/dist/rx.all.js',
        //'bower_components/immutable/dist/immutable.min.js',
        '../bower_components/moment/min/moment-with-locales.min.js',
        '../bower_components/axios/dist/axios.min.js',
        //'bower_components/numeral/min/numeral.min.js',
        '../bower_components/toastr/toastr.min.js'
    ],
    systemJS: 'node_modules/systemjs/dist/system.js',
    fonts: [
        '../bower_components/bootstrap/dist/fonts/*.*',
        '../bower_components/font-awesome/fonts/*.*'],
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        dist: './bin',
        distPublic: './bin/public',
        distImages: './bin/public/images',
        distJs: './bin/public/js',
        distCss: './bin/public/css',
        distFonts: './bin/public/fonts',
        mainJS: ['./client/main.js'],
        less: './assets/less/main.less',
        tests: './server/tests/*.js'
    },
    images: ['assets/images/*.*', '../assets/images/*.*'],
    less: ['assets/less/*.less'],
    server: [
        'server/**/*.js', 'server/**/*.ejs', '../common_server/**/*.js', 'Procfile', 'package.json']
};

gulp.task('clean', function(done) {
    return del([config.paths.dist], function (err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n\t'));
        console.log('Finished task: cleanup');
    })
});

//SERVER JS
gulp.task('server', [], function() {
    return gulp
        .src(config.server)//
        .pipe(gulp.dest(config.paths.dist));
});

//Auto start
gulp.task('auto', function() {
   var server = new LiveServer();
    server.start('./bin/www.js');
});

//ASSETS
gulp.task('images', function() {
    return gulp
        .src(config.images)//
        .pipe(gulp.dest(config.paths.distImages));
});

gulp.task('fonts', function() {
    return gulp
        .src(config.fonts)//'./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,woff2,eot,eof,svg}'
        .pipe(gulp.dest(config.paths.distFonts));
});

gulp.task('vendorCss', [], function () {
    return gulp.src(config.vendorCSS)
        .pipe(concat("bundle.css"))
        .pipe(gulp.dest(config.paths.distCss));
});

//App CSS
gulp.task('less', function() {
    return gulp.src(config.paths.less) // #2
        .pipe(less())
        //.pipe(minifyCSS())
        .pipe(prefix())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest(config.paths.distCss));
});

//vendor JS
gulp.task('vendorJS', [], function () {
    return gulp.src(config.vendorJS)
        .pipe(concat("bundle.js"))
        .pipe(gulp.dest(config.paths.distJs));
});
//JS
gulp.task('js', [], function() {
    return browserify({ entries: config.paths.mainJS, debug: true })
        .transform( ["babelify", {presets: ['react']} ])
        .bundle()    // .on('error', console.error.bind(console))"es2015",
        .pipe(source('main.js'))//following 3 lines add structure to sources in Chrome dev tools
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.paths.distJs));
});
//gulp.task('js', [], function () {
//    return gulp.src(config.paths.mainJS)
//        .pipe(concat("main.js"))
//        .pipe(gulp.dest(config.paths.distJs));
//});

gulp.task('assets', ['images', 'fonts', 'vendorCss', 'vendorJS', 'less']);
gulp.task('default', ['js']);
