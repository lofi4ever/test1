var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber      = require('gulp-plumber'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    smartgrid    = require('smart-grid'),
    gcmq         = require('gulp-group-css-media-queries'),
    notify       = require( 'gulp-notify' );


gulp.task('grid', function() {
    /* It's principal settings in smart grid project */
    var settings = {
        outputStyle: 'sass', /* less || scss || sass || styl */
        columns: 12, /* number of grid columns */
        offset: '30px', /* gutter width px || % */
        mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
        container: {
            maxWidth: '1200px', /* max-width оn very large screen */
            fields: '30px' /* side fields */
        },
        breakPoints: {
            lg: {
                width: '1100px', /* -> @media (max-width: 1100px) */
            },
            md: {
                width: '960px'
            },
            sm: {
                width: '780px',
                fields: '15px' /* set fields only if you want to change container.fields */
            },
            xs: {
                width: '560px'
            }
            /* 
            We can create any quantity of break points.

            some_name: {
                width: 'Npx',
                fields: 'N(px|%|rem)',
                offset: 'N(px|%|rem)'
            }
            */
        }
    };

    smartgrid('app/libs/', settings);

});


gulp.task('mytask', function() {
    console.log('привчик, я таск!');
});
gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.sass')
      .pipe(sass({outputStyle: 'expand'}).on('error', notify.onError({
        message: "<%= error.message %>",
        title  : "Sass Error!"
      })))
      .pipe(autoprefixer(['last 15 versions']))
      .pipe(gcmq())
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync({
      server: {
          baseDir: 'app'
      },
      notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src([
      'app/js/common.js'
      ])
      .pipe(concat('scripts.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/js/final'))
      .pipe(browserSync.reload({stream: true}))
});

gulp.task('default', ['browser-sync', 'sass', 'scripts'], function() {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/*.js', ['scripts']);
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')) 
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
    var buildLibs = gulp.src('app/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'))

    var buildCss = gulp.src('app/css/main.css')
    .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/final/scripts.min.js')
    .pipe(gulp.dest('dist/js/final'))

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
})