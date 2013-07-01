/**
 * Copyright 2013 Intel Corporate Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// this is to replace the Mocha grunt tasks I've tried which
// use Mocha programmatically and lose all the helpful, colour-coded output
// about which test failed and how; I've resorted to running the
// command line mocha instead
module.exports = function (grunt) {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var spawn = require('child_process').spawn;

  // options
  // reporter: set the name of the mocha reporter; if 'html-cov'
  // a coverage report is produced (requires that the js code has
  // been instrumented by blanket first otherwise the report will
  // be blank)
  // browser: command to open the browser; the URL is passed as the first argument
  grunt.registerMultiTask('mochaccino', 'Banal mocha runner', function () {
    var done = this.async();

    var mocha = this.data.cmd || process.env.MOCHA || 'mocha';
    var blanket = this.data.blanket || 'blanket';
    var browserCmd = this.data.browserCmd;
    var reporter = this.data.reporter || 'dot';
    var reportDir = this.data.reportDir || '.';

    if (grunt.file.exists(reportDir)) {
      if (!grunt.file.isDir(reportDir)) {
        grunt.fatal('cannot use ' + reportDir + ' as reportDir because ' +
                    'file already exists and is not a directory');
      }
    }
    else {
      grunt.file.mkdir(reportDir);
    }

    var args = ['-R', reporter];

    var mochaOptions = {stdio: 'inherit'};
    var covReportStream = null;

    if (reporter === 'html-cov') {
      args.push('--require');
      args.push(blanket);

      var timestamp = grunt.template.date('yyyy-mm-dd_HHMMss');
      var covReportFilename = 'cov-' + timestamp + '.html';
      var covReportPath = path.join(reportDir, covReportFilename);

      var streamOpts = {
        flags: 'w',
        encoding: 'utf-8',
        mode: '0666'
      };

      covReportStream = fs.createWriteStream(covReportPath, streamOpts);

      mochaOptions.stdio = [0, 'pipe', 2];
    }

    this.filesSrc.forEach(function (file) {
      args.push(file);
    });

    var cmd = mocha + ' ' + args.join(' ');
    grunt.log.ok('mocha command: ' + cmd);

    var child = spawn(mocha, args, mochaOptions);

    if (covReportStream) {
      child.stdio[1].pipe(covReportStream);
    }

    var checkTestStatus = function (code) {
      if (code === 0) {
        done();
      }
      else {
        grunt.fatal('one or more tests failed');
      }
    };

    child.on('exit', function (code) {
      if (covReportStream) {
        grunt.log.ok('coverage report is available at ' + covReportPath);

        if (browserCmd) {
          var args = [covReportPath];
          var browser = spawn(browserCmd, args);

          browser.on('exit', function (browserCode) {
            if (browserCode === 0) {
              checkTestStatus(code);
            }
            else {
              grunt.fatal('could not start browser with command "' +
                          browserCmd + ' ' + args.join(' ') + '"');
            }
          });
        }
        else {
          checkTestStatus(code);
        }
      }
      else {
        checkTestStatus(code);
      }
    });
  });
};
