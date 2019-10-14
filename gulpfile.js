const gulp = require('gulp');
const screeps = require('gulp-screeps');
const rename = require('gulp-rename')
const clean = require('gulp-clean')
const credentials = require('./.screeps.json');

gulp.task('clean', gulp.series(() => {
    return gulp.src('dist/', {read: false}).pipe(clean())
}))

gulp.task('copy', gulp.series('clean', function () {
    const src = gulp.src('src/**/*.js')
    return src.pipe(rename((path) => {
        const parts = path.dirname.match(/[^/\\]+/g)
        let name = ''
        for (const i in parts) {
            if (parts[i] !== '.') {
                name += parts[i] + '_'
            }
        }
        name += path.basename
        path.basename = name
        path.dirname = ''
    })).pipe(gulp.dest('dist/'))
}))

gulp.task('deploy', gulp.series('copy', function () {
    return gulp.src('dist/*.js').pipe(screeps(credentials))
}))