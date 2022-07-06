const {gulp, src, dest, parallel, series, watch, sourcemaps} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const fileinclude = require('gulp-file-include');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
// const concat = require('gulp-concat');

const path = {
	prod: {
		html: 'prod/',
		css: 'prod/css/',
		js: 'prod/js/',
		img: 'prod/img/',
		font: 'prod/font/'
	},
	dev: {
		html: 'dev/**/*.{html,htm}',
		css: 'dev/scss/**/*.scss',
		js: 'dev/js/**/*.js',
		img: 'dev/img/**/*.{png,jpeg,jpg,gif,svg}',
		docs: 'dev/docs/**/*.{pdf,xls,xlsx}',
        font: 'dev/font/**/*'
	},
}

function browsersync() {
	browserSync.init({
		server: {
			baseDir: path.prod
		},
		notify: false
	});
}

// USE include file
function html() {
	return src(path.dev.html)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(dest(path.prod.html))
		.pipe(browserSync.stream());

}

// FONTS
function font() {
	return src(path.dev.font)
		.pipe(dest(path.prod.font))
		.pipe(browserSync.stream());

}

// SASS -> CSS -> min
function styles() {
	return src(path.dev.css, {sourcemaps: true})
		.pipe(sass({
				errLogToConsole: true,
				outputStyle: "compressed"
			})
		) // Используем gulp-sass
		.pipe(autoprefixer())
		.pipe(dest(path.prod.css))
		.pipe(cleanCSS(
			{
				level: {
					2: {
						specialComments: 0
					}
				}
			}
		))
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(dest(path.prod.css, {sourcemaps: '.'}))
		.pipe(browserSync.stream());
}

// JS -> min
function js() {
	return src(path.dev.js, {sourcemaps: true})
		// .pipe(concat('main.js'))
		.pipe(dest(path.prod.js))
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(dest(path.prod.js, {sourcemaps: '.'}))
		.pipe(browserSync.stream());
}

// IMG -> min
function imgMin() {
	return src(path.dev.img)
		.pipe(imagemin([], {
			verbose: true
		}))
		.pipe(dest(path.prod.img))
}

// Watching files
function watchFiles() {
	watch(path.dev.css, styles).on('change', browserSync.reload);
	watch(path.dev.html, html).on('change', browserSync.reload);
	watch(path.dev.js, js).on('change', browserSync.reload);
	watch(path.dev.img, imgMin);
	watch(path.dev.font, font);
	// Другие отслеживания
}

// Del prod files
function delProd() {
	return del(path.prod.html)
}

exports.default = series(
	delProd,
	parallel(
		html,
		styles,
		js,
		imgMin,
		font
	),
	parallel(
		browsersync,
		watchFiles
	)
)