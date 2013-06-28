module.exports = function (grunt) {
  grunt.loadTasks('../../tasks');

  grunt.initConfig({
    mochaccino: {
      all: {
        mocha: 'mocha',
        files: { src: 'test/**.test.js' }
      }
    }
  });

  grunt.registerTask('default', 'mochaccino');
};
