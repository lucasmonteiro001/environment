/**
 * Created by lucas on 6/29/16.
 */
"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // Runs local dev server
var open = require('gulp-open'); // Opens a URL in the web browser
var browserify = require('browserify'); // Bundles JS
var source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
var concat = require('gulp-concat'); // Concatenates files
var lint = require('gulp-eslint'); // Lint JS files, including JSX

var config = {
    port: 3000,
    devBaseUrl: 'http:localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist: './dist',
        mainJs: './src/js/main.js'
    }
};

// Starts a local development server
gulp.task('connect', function() {
    connect.server({ // server config
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true // anytime files change, it will reload the browser
    });
});

// Open a given file in the server
// Dependencies: task connect
gulp.task('open', ['connect'], function() {
    gulp.src('dist/index.html')
        .pipe(open({uri: config.devBaseUrl + ":" + config.port + '/'}));
});

gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist)) // pipes all html files and send them to the destination
        .pipe(connect.reload()); // reload the server
});

gulp.task('js-bundle', function () {
    browserify(config.paths.mainJs)
        .bundle() // bundle all js files into one
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
});

gulp.task('css-bundle', function () {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('lint', function () {
    return gulp.src(config.paths.js)
        .pipe(lint({config: 'eslint.config.json'}))
        .pipe(lint.format());
});

// Everytime someething changes, reload all the files and server
gulp.task('watch', function() {
    // Everytime any file under config.paths.html change, reload the server
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.css, ['css-bundle']);
    gulp.watch(config.paths.js, ['js-bundle', 'lint']);
})

// Default task to ben run when 'gulp'is typed on terminal
gulp.task('default', ['html', 'js-bundle', 'css-bundle', 'lint', 'open', 'watch']);
// gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);