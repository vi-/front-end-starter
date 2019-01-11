'use strict';

const { series, parallel, src, dest, watch } = require( 'gulp' );

const	uglify				= require( 'gulp-uglify' ),
			rename				= require( 'gulp-rename' ),
			sass					= require( 'gulp-sass' ),
			maps					= require( 'gulp-sourcemaps' ),
			babelify			= require( 'babelify' ),
			del 					=	require( 'del' ),
			cssnano				=	require( 'gulp-cssnano' ),
			browserSync 	= require( 'browser-sync' ).create(),
			autoprefixer	= require( 'gulp-autoprefixer' ),
			imagemin			= require( 'gulp-imagemin' ),
			browserify 		= require( 'browserify' ),
			source 				= require( 'vinyl-source-stream' ),
			buffer 				= require( 'vinyl-buffer' );

const serveSite = ( cb ) => {
	browserSync.init({
		server: { baseDir: "./" }
	});
	watchFiles();
}

const compileCSS = () => {
	return src( 'src/scss/main.scss' )
		.pipe( maps.init() )
		.pipe( sass().on( 'error', function(err) {
			console.error( err.message );
			browserSync.notify( err.message, 3000 );
			this.emit( 'end' );
		}))
		.pipe(rename( 'style.css' ))
		.pipe(autoprefixer({
						browsers: [ 'last 2 versions' ],
						cascade: false
		}))
		.pipe(maps.write( './' ))
		.pipe(dest( 'css' ));
}

const minifyCSS = () => {
	return src( 'css/style.css' )
		.pipe(cssnano())
		.pipe(dest( 'css' ));
}

const compileJS = () => {
	const b = browserify({
	  entries: './src/js/myscript.js',
	  debug: true,
	  transform: [babelify]
	});
	return b.bundle()
	  .pipe(source( 'script.js' ))
	  .pipe(buffer())
	  .pipe(maps.init({ loadMaps: true }))
	  .pipe(maps.write( './' ))
	  .pipe(dest( './js/' ));
}

const minifyJS = () => {
	return src( 'js/script.js' )
		.pipe(uglify())
		.pipe(dest('js'));
}

const minifyImages = () => {
	return src( 'src/images/*' )
		.pipe(imagemin())
		.pipe(dest( 'images/' ));
}

const copyFonts = () => {
	return src( 'src/fonts/**' )
		.pipe( dest( './fonts' ) );
}

const watchFiles = () => {
	watch( 'src/scss/**/*.scss', compileCSS );
	watch( 'css/style.css' ).on( 'change', browserSync.reload );
	watch( 'src/js/**/*.js', compileJS );
	watch( 'js/script.js' ).on( 'change', browserSync.reload );
	watch( 'src/images/*', minifyImages );
	watch( 'images/*' ).on( 'change', browserSync.reload );
	watch( 'src/fonts/*', copyFonts );
	console.log( '👀 Watching files 👀' );
}

const clean = () => {
	del([
		'dist',
		'images',
		'css/style.css*',
		'js/script.js*'
	]);
}

const build = () => {
	return src([
			'css/style.css',
			'fonts/**',
			'images/**',
			'js/script.js',
			'index.html'
		], { base: './' })
	.pipe(dest( 'dist' ));
}

exports.default = series( parallel( compileCSS, compileJS ), serveSite );
exports.build 	= series(
	parallel( compileCSS, compileJS ), 
	parallel( minifyCSS, minifyJS ),
	parallel( copyFonts, minifyImages ),
	build
);