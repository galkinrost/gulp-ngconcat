var concat = require('../');
var glob = require('glob');
var fs = require('fs');
var should = require('should');
var path = require('path');
var async = require('async');
var File = require('gulp-util').File;

describe('gulp-ngconcat', function () {
    describe('concat()', function () {

        testFiles(concat('expected/first.js'), 'src/first/**/*.js', 'first.js');
        /* var input;

         input = ['wadup'];
         testFiles(concat('test.js'), input, 'wadup');
         testFiles(concat('test.js', {newLine: '\r\n'}), input, 'wadup');
         testFiles(concat('test.js', {newLine: ''}), input, 'wadup');

         input = ['wadup', 'doe'];
         testFiles(concat('test.js'), input, 'wadup\ndoe');
         testFiles(concat('test.js', {newLine: '\r\n'}), input, 'wadup\r\ndoe');
         testFiles(concat('test.js', {newLine: ''}), input, 'wadupdoe');

         input = ['wadup', 'doe', 'hey'];
         testFiles(concat('test.js'), input, 'wadup\ndoe\nhey');
         testFiles(concat('test.js', {newLine: '\r\n'}), input, 'wadup\r\ndoe\r\nhey');
         testFiles(concat('test.js', {newLine: ''}), input, 'wadupdoehey');

         input = [
         [65, 66],
         [67, 68],
         [69, 70]
         ];
         testFiles(concat('test.js'), input, 'AB\nCD\nEF');
         testFiles(concat('test.js', {newLine: '\r\n'}), input, 'AB\r\nCD\r\nEF');
         testFiles(concat('test.js', {newLine: ''}), input, 'ABCDEF');*/

        function testFiles(stream, pattern, expected) {
            it('should concat one or several files', function (done) {
                stream.on('data', function (newFile) {
                    should.exist(newFile);
                    should.exist(newFile.path);
                    should.exist(newFile.relative);
                    should.exist(newFile.contents);

                    var newFilePath = path.resolve(newFile.path);
                    var expectedFilePath = path.resolve(path.join('expected', expected));

                    newFilePath.should.equal(expectedFilePath);

                    newFile.relative.should.equal(path.join('expected', expected));
                    String(newFile.contents).should.equal(fs.readFileSync(expectedFilePath, 'utf-8'));
                    Buffer.isBuffer(newFile.contents).should.equal(true);
                    done();
                });

                async.waterfall([
                    function (next) {
                        glob(pattern, next);
                    },
                    function (filenames, next) {
                        async.each(filenames, function (filename, done) {
                            fs.readFile(filename, function (err, buffer) {
                                if (err) {
                                    return done(err);
                                }
                                var filepath = path.resolve(path.join('src', filename)),
                                    base = path.dirname(path);

                                stream.write(new File({
                                    cwd: process.cwd(),
                                    base: base,
                                    path: filepath,
                                    contents: buffer
                                }));
                                done();
                            })
                        }, next);
                    }
                ], function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    stream.end();
                });
            });
        }
    });
});