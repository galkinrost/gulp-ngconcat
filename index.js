var concat = require('ngconcat'),
    through = require('through'),
    path = require('path'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    File = gutil.File;

module.exports = function (fileName, opt) {
    if (!fileName) throw new PluginError('gulp-ngconcat', 'Missing fileName option for gulp-ngconcat');
    if (!opt) opt = {};
    // to preserve existing |undefined| behaviour and to introduce |newLine: ""| for binaries
    if (typeof opt.newLine !== 'string') opt.newLine = gutil.linefeed;
    var self = this;
    var buffer = [];
    var firstFile = null;
    var newLineBuffer = opt.newLine ? new Buffer(opt.newLine) : null;

    function bufferContents(file) {
        if (file.isNull()) return; // ignore
        if (file.isStream()) return this.emit('error', new PluginError('gulp-ngconcat', 'Streaming not supported'));

        if (!firstFile) firstFile = file;

        try {
            var info = concat.mapSource(file.contents.toString('utf-8'), file.path);
        } catch (err) {
            self.emit('error', new gutil.PluginError('gulp-ngconcat', err));
        }

        info.contents = file.contents;

        buffer.push(info);
    }

    function endStream() {
        if (buffer.length === 0) return this.emit('end');

        var joinedContents = (function concat(sorted, buffers) {
            for (var i in sorted) {
                buffers.push(sorted[i].contents);
                i < sorted.length - 1 && buffers.push(newLineBuffer);
            }
            return Buffer.concat(buffers);
        })(concat.sort(buffer), []);

        var joinedPath = path.join(firstFile.base, fileName);

        var joinedFile = new File({
            cwd: firstFile.cwd,
            base: firstFile.base,
            path: joinedPath,
            contents: joinedContents
        });

        this.emit('data', joinedFile);
        this.emit('end');
    }

    return through(bufferContents, endStream);
};