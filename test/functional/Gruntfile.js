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
        reportDir: 'build',
        browserCmd: 'google-chrome'
      }
    }
  });

  grunt.registerTask('default', [
    'mochaccino:all',
    'mochaccino:cov'
  ]);
};
