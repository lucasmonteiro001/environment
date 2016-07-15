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
    babel = require('gulp-babel');

const config = {
    port: 3000,
    devBaseUrl: 'http:localhost',
    root: "dist",
    paths: {
        html: './src/**/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist: './dist',
        landingPage: 'dist/index.html'
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
        console.log("aqui")
        fileName = filePath.split('/');
        fileName = fileName[fileName.length - 1];
    }

    let bundleStream = browserify(filePath)
        .transform("babelify", {presets: ["es2015"]}).bundle();

    // Save the new generated file in the required distPath
    bundleStream
        .pipe(source(fileName))
        .pipe(gulp.dest(distPath));

};

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
        .pipe(open({uri: config.devBaseUrl + ":" + config.port + '/'}));
});

gulp.task('html', () => {

    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.distPaths.html)) // pipes all html files and send them to the destination
        .pipe(connect.reload()); // reload the server
});

gulp.task('js-bundle', () => {

    bundle({
        distPath: config.distPaths.js,
        filePath: './src/js/main.js',
        fileName: "main.js"});

    bundle({
        distPath: config.distPaths.js,
        filePath: './src/js/test.js',
        fileName: "test.js"});
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