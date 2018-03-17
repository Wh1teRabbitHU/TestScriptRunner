'use strict';

const gulp       = require('gulp');
const composer   = require('gulp-uglify/composer');
const babel      = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglifyEs   = require('uglify-es');
const browserify = require('browserify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const globify    = require('require-globify');
const del        = require('del');

const pconfig = require('./package.json');

const APP_NAME                     = pconfig.name;
const uglifyEs6                    = composer(uglifyEs, console);

const RELEASE_JS_SRC_PATH          = './src/browser.js';
const RELEASE_JS_FILENAME          = APP_NAME + '.js';
const RELEASE_JS_MINIFIED_FILENAME = APP_NAME + '.min.js';
const RELEASE_JS_BABEL_FILENAME    = APP_NAME + '-babel.min.js';
const RELEASE_TARGET_FOLDER        = './release/';

gulp.task('clean-release', () => {
	return del(RELEASE_TARGET_FOLDER + '**/*');
});

gulp.task('release-js', () => {
	let bundle = browserify(RELEASE_JS_SRC_PATH, { debug: false })
		.transform(globify);

	return bundle
		.bundle()
		.pipe(source(RELEASE_JS_FILENAME))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(RELEASE_TARGET_FOLDER));
});

gulp.task('release-js-minified', () => {
	let bundle = browserify(RELEASE_JS_SRC_PATH, { debug: false })
		.transform(globify);

	return bundle
		.bundle()
		.pipe(source(RELEASE_JS_MINIFIED_FILENAME))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglifyEs6())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(RELEASE_TARGET_FOLDER));
});

gulp.task('release-js-minified-babel', () => {
	let bundle = browserify(RELEASE_JS_SRC_PATH, { debug: false })
		.transform(globify);

	return bundle
		.bundle()
		.pipe(source(RELEASE_JS_BABEL_FILENAME))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(babel({ presets: 'babel-preset-env' }))
		.pipe(uglifyEs6())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(RELEASE_TARGET_FOLDER));
});

gulp.task('compile-release', gulp.series('clean-release', gulp.parallel('release-js', 'release-js-minified', 'release-js-minified-babel')));

gulp.task('default', gulp.series('compile-release'));