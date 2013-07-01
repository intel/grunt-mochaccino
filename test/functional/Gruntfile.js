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
module.exports = function (grunt) {
  var blanketPath = '../../node_modules/blanket';

  grunt.loadTasks('../../tasks');

  grunt.initConfig({
    mochaccino: {
      all: {
        files: { src: 'test/**.test.js' }
      },
      cov: {
        blanket: blanketPath,
        files: { src: 'test/**.test.js' },
        reporter: 'html-cov',
        reportDir: 'build'
      }
    }
  });

  grunt.registerTask('default', [
    'mochaccino:all',
    'mochaccino:cov'
  ]);
};
