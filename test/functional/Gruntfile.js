module.exports = function (grunt) {
  grunt.loadTasks('../../tasks');

  grunt.initConfig({
    mochaccino: {
      all: {
        mocha: 'mocha',
        files: { src: 'mocha-tests/**.test.js' }
      }
    }
  });

  grunt.registerTask('default', 'mochaccino');
};
