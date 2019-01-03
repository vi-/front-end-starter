'use strict';

const gulp					= require('gulp'),
			uglify				= require('gulp-uglify'),
			rename				= require('gulp-rename'),
			sass					= require('gulp-sass'),
			maps					= require('gulp-sourcemaps'),
			babelify			= require('babelify'),
			del 					=	require('del'),
			cssnano				=	require('gulp-cssnano'),
			browserSync 	= require('browser-sync').create(),
			autoprefixer	= require('gulp-autoprefixer'),
			imagemin			= require('gulp-imagemin'),
			browserify 		= require('browserify'),
			source 				= require('vinyl-source-stream'),
			buffer 				= require('vinyl-buffer');

gulp.task( "scripts", () => {
  const b = browserify({
    entries: './src/js/myscript.js',
    debug: true,
    transform: [babelify]
  });
  return b.bundle()
    .pipe(source('script.js'))
    .pipe(buffer())
    .pipe(maps.init({ loadMaps: true }))
      // transforms
      //.pipe(uglify())
    .pipe(maps.write('./'))
    .pipe(gulp.dest( './js/' ));
});

gulp.task("sass", () => {
	return gulp.src('src/scss/main.scss')
		.pipe(maps.init())
		.pipe(sass().on('error', function(err) {
			console.error(err.message);
			browserSync.notify(err.message, 3000);
			this.emit('end');
		}))
		.pipe(rename('style.css'))
		.pipe(autoprefixer({
						browsers: ['last 2 versions'],
						cascade: false
		}))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('css'));
});

gulp.task("minStyles", ["sass"], () => { 
	return gulp.src('css/style.css')
		.pipe(cssnano())
		.pipe(gulp.dest('css')); 
});

gulp.task("minImages", () => {
	return gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('images/'))
});

gulp.task("serve", ["sass", "scripts", "minImages"], () => {
	browserSync.init({
		server: { baseDir: "./" }
	});
	gulp.watch('src/scss/**/*.scss', ["sass"]);
	gulp.watch('src/js/**/*.js', ["scripts"]);
	gulp.watch('src/images/*', ["minImages"]);
	gulp.watch('src/fonts/*', ["copyfonts"]);
	gulp.watch('css/style.css').on('change', browserSync.reload);
	gulp.watch('js/script.js').on('change', browserSync.reload);
	gulp.watch('index.html').on('change', browserSync.reload);
	gulp.watch('images/*').on('change', browserSync.reload);
});

gulp.task("copyfonts", ()=> {
	return gulp.src('src/fonts/**')
		.pipe(gulp.dest('./fonts'));
});

gulp.task("clean", () => {
	del([
		'dist',
		'images',
		'css/style.css*',
		'js/script.js*'
	]);
});

gulp.task("build", [ "copyfonts", "scripts", "minStyles", "minImages" ], () => {
	return gulp.src([
			'css/style.css',
			'fonts/**',
			'images/**',
			'js/script.js',
			'style.css',
			'index.html'
		], { base: './' })
	.pipe(gulp.dest('dist'));
});

gulp.task("default", [ "clean" ], () => gulp.start("build"));