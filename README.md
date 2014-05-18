NGCONCAT
=========

NGCONCAT is lightweight tool to concat your Angular.js application in one file.

Other plugins
--
<a href="https://github.com/galkinrost/grunt-ngconcat">Grunt</a>

Development
--
<a href="https://github.com/galkinrost/ngconcat">NgConcat</a>

Install
--
```sh
npm install gulp-ngconcat
```

API
--

```javascript
var gulp=require('gulp');
var concat=require('gulp-ngconcat');

gulp.task('concat',function(){
    gulp.src('/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch',function(){
    gulp.watch('/**/*.js',['concat']);
});

```

License
----

MIT

