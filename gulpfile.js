// Gulp Deploy Dependencies
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	del = require('del'),
	watch = require('gulp-watch');

// This is an object which defines paths for the styles.
// The folder, files to look for and destination are all required for sass
var paths = {
	styles: {
		src: './scss',
		files: [
			'./scss/**/*.scss',
			'!scss/**/*_scsslint_tmp*.scss'
		],
		dest: './css/',
		del: './css/**/*'
	},
	html: {
		files: './**/*.html'
	}
};

// Clean
gulp.task('clean', function (cb) {
	del.sync([
		paths.styles.del,
		// we don't want to clean this file though so we negate the pattern
		'!./Content/css/deploy.txt'
	], { force: true }, cb);
});

// Sass compilation for Production
gulp.task('sassProd', function () {
	// Taking the path from the above object
	var sassTM = gulp.src(paths.styles.files)
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.on('error', sass.logError)
		// Funally put the compiled sass into a css file
		.pipe(gulp.dest(paths.styles.dest));

	return sassTM;
});

// Gulp Development Dependencies
var watch = require('gulp-watch'),
	size = require('gulp-size'),
	browserSync = require('browser-sync').create();

// Sass compilation
gulp.task('sass', function () {
	gulp.src(paths.styles.files)
		.pipe(sass.sync({
			sourceComments: 'normal'
		}).on('error', sass.logError))
		.pipe(size({ showFiles: true }))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());
});

// Sass watch

gulp.task('watch', function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	gulp.watch(paths.styles.files, ['sass']);
	gulp.watch(paths.html.files).on('change', browserSync.reload);
});

// Default task
gulp.task('default', ['clean', 'sass', 'watch']);
gulp.task('prod', ['clean', 'sassProd']);

