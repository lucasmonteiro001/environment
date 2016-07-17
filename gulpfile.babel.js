/**
 * Created by lucas on 6/29/16.
 */
"use strict";

const gulp = require('gulp'),
    connect = require('gulp-connect'), // Runs local dev server
    open = require('gulp-open'), // Opens a URL in the web browser
    browserify = require('browserify'), // Bundles JS
    source = require('vinyl-source-stream'), // Use conventional text streams with Gulp
    concat = require('gulp-concat'), // Concatenates files
    lint = require('gulp-eslint'), // Lint JS files, including JSX
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify'),
    esdoc = require("gulp-esdoc");

const config = {
    port: 3000,
    devBaseUrl: 'http:localhost',
    root: "dist",
    paths: {
        html: './src/**/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
            './src/**/*.css'
        ],
        dist: './dist',
        landingPage: 'dist/vis.html'
    },
    distPaths: {
        js: './dist/js/',
        html: './dist',
        css: './dist/css/'
    }
};

/**
 * Create a bundled file
 * @param options
 */
const bundle = (options) => {

    let distPath = options.distPath,
        filePath = options.filePath,
        fileName = options.fileName;

    // distPath and filePath are always required to the bundle function
    if(distPath === undefined || filePath === undefined) {
        throw "distPath and filePath are required!";
    }

    // If fileName is not an argument, get the name from filePath
    if(fileName === undefined) {
        fileName = filePath.split('/');
        fileName = fileName[fileName.length - 1];
    }

    let bundleStream = browserify(filePath)
        .transform("babelify", {presets: ["es2015"]}).bundle();

    // Save the new generated file in the required distPath
    bundleStream
        .pipe(source(fileName))
        .pipe(gulp.dest(distPath));

    // Generate minified file if required
    if(options.uglify === true) {

        gulp.src(config.distPaths.js + fileName)
            .pipe(minify({
                ext:{
                    min:'.min.js'
                },
                mangle: false,
                compress: {
                    sequences     : true,  // join consecutive statemets with the “comma operator”
                    properties    : true,  // optimize property access: a["foo"] → a.foo
                    dead_code     : true,  // discard unreachable code
                    drop_debugger : true,  // discard “debugger” statements
                    unsafe        : false, // some unsafe optimizations (see below)
                    conditionals  : true,  // optimize if-s and conditional expressions
                    comparisons   : true,  // optimize comparisons
                    evaluate      : true,  // evaluate constant expressions
                    booleans      : true,  // optimize boolean expressions
                    loops         : true,  // optimize loops
                    unused        : true,  // drop unused variables/functions
                    hoist_funs    : true,  // hoist function declarations
                    hoist_vars    : false, // hoist variable declarations
                    if_return     : true,  // optimize if-s followed by return/continue
                    join_vars     : true,  // join var declarations
                    cascade       : true,  // try to cascade `right` into `left` in sequences
                    side_effects  : true,  // drop side-effect-free statements
                    warnings      : true  // warn about potentially dangerous optimizations/code
                }
            }))
            .pipe(gulp.dest(config.distPaths.js));
    }
};


gulp.task('doc', function (cb) {
    gulp.src("./src")
        .pipe(esdoc({ destination: "./docs" }));
});

// Starts a local development server
gulp.task('connect', () => {
    connect.server({ // server config
        root: [config.root],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true // anytime files change, it will reload the browser
    });
});

// Open a given file in the server
// Dependencies: task connect
gulp.task('open', ['connect'], () => {

    gulp.src(config.paths.landingPage)
        .pipe(open({uri: config.devBaseUrl + ":" + config.port + '/vis.html'}));
});

gulp.task('html', () => {

    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist)) // pipes all html files and send them to the destination
        .pipe(connect.reload()); // reload the server

});

gulp.task('js-bundle', () => {

    bundle({
        distPath: config.distPaths.js,
        filePath: './src/js/vis.js',
        fileName: "vis.js",
        uglify: true});
});

gulp.task('css-bundle', () => {

    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.distPaths.css));
});

gulp.task('lint', () => {

    return gulp.src(config.paths.js)
        .pipe(lint({config: 'eslint.config.json'}))
        .pipe(lint.format());
});

// Everytime someething changes, reload all the files and server
gulp.task('watch', () => {

    // Everytime any file under config.paths.html change, reload the server
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.css, ['css-bundle']);
    gulp.watch(config.paths.js, ['js-bundle', 'lint']);
    gulp.watch('./*.js', ['js-bundle', 'lint']);
})

// Default task to ben run when 'gulp'is typed on terminal
gulp.task('default', ['html', 'js-bundle', 'css-bundle', 'lint', 'open', 'watch']);
// gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);