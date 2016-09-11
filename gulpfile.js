var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename'),
    spritesmith = require('gulp.spritesmith'),
    buffer = require('vinyl-buffer'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    merge = require('merge-stream'),
    concat = require('gulp-concat');

gulp.task('js', function () {
    return merge(
        gulp.src('src/js/*.js')
            .pipe(concat("all.js"))
            .pipe(gulp.dest('dist/js'))
            .pipe(uglify())
            .pipe(rename({ extname: ".min.js" }))
            .pipe(gulp.dest('dist/js'))
            .pipe(connect.reload()),
        gulp.src('bower_components/jquery/dist/jquery.min.js')
            .pipe(gulp.dest('dist/js'))
    )
})

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/images/sprites/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }));

    var imgStream = spriteData.img
        // DEV: We must buffer our stream into a Buffer for `imagemin`
        .pipe(buffer())
        .pipe(imagemin())
        .pipe(gulp.dest('dist/css'));

    var cssStream = spriteData.css
        .pipe(cleanCSS())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('dist/css'));

    return merge(imgStream, cssStream);
})

gulp.task('css', ['sprite'], function () {
    var cssStream = gulp.src('src/sass/**/*.scss')
        .pipe(sass())
        .pipe(concat("styles.css"))
        .pipe(gulp.dest('dist/css'))
        .pipe(cleanCSS({ debug: true }, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize + " => " + details.stats.minifiedSize + " bytes");
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('dist/css'));
    return cssStream;
})

gulp.task('html', function () {
    return gulp.src('./*.html')
        .pipe(connect.reload());
});


gulp.task('connect', function () {
    return connect.server({
        livereload: true
    });
})

gulp.task('clean', function () {
    return gulp.src('dist', { read: false })
        .pipe(clean())
})

gulp.task('build', ['html', 'css', 'js', 'sprite'])

gulp.task('default', ['connect', 'build', 'watch']);

gulp.task('watch', function () {
    gulp.watch("*.html", ['html']);
    gulp.watch("src/**/*.js", ['js'])
    gulp.watch("src/**/*.scss", ['css'])
    gulp.watch("src/images/*", ['sprite'])
})

