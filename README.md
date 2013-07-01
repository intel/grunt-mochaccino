# grunt-mochaccino

A grunt plugin to run tests via command-line mocha.

Other mocha plugins for grunt use the mocha library programmatically, which loses a lot of useful diagnostic information. This plugin is an alternative to those, instead using the command line tool to keep mocha's full output.

It also tries to make production of coverage reports simple, mainly by documenting exactly how to produce them.

Note that the configuration options available for the task are limited, as the aim of the plugin was to keep complexity low. Feature requests or patches are welcome, of course.

# License

Apache version 2, copyright Intel Corporation Ltd. See <em>LICENSE</em> for more details.

# Contributing

Contributions are welcome. Some examples of how you could help:

1.   Report bugs or make feature requests through [the issue tracker](https://github.com/01org/grunt-mochaccino/issues).

2.   Fix bugs or add features, then make a pull request to have your code merged. The preferred approach is to make a github fork, write your code, and make a pull request for it to be merged into the grunt-mochaccino master branch. The [#Hacking] section explains a bit more about how to this.

## <a name="Hacking"></a>Hacking

1.  Make a fork of grunt-mochaccino on github.

2.  Clone it to your development machine.

3.  Modify the task code: currently it's in a single file, <em>tasks/grunt-mochaccino</em>.

4.  Run the meagre test suite. There is a basic functional test in <em>test/functional</em> to check that the plugin mostly works. Run it by opening that directory and entering <code>grunt</code> at the command line. Feel free to add more tests...

5.  Make a github pull request to have your branch merged into grunt-mochaccino master.

# Getting started

grunt-mochaccino has been tested on:

*   Fedora 17 Linux (64bit)

*   Windows 7 Enterprise (64bit)

You need **Grunt ~0.4.1**.

You will also need a global install of mocha:

    npm install -g mocha

Next, install the grunt-mochaccino plugin in your project with:

    npm install grunt-mochaccino --save-dev

Then add a line to your <em>Gruntfile.js</em> near the top:

    module.exports = function (grunt) {
      grunt.loadNpmTasks('grunt-mochaccino');

      // ... rest of your grunt config ...
    };

See the next section for configuration options.

# mochaccino task

The mochaccino task calls the command-line mocha runner, passing any required extra options (e.g. <code>-R blanket</code> if you configure the reporter as <code>"html-cov"</code>) and the list of test files (derived from the <code>files</code> property for the task).

While grunt-mochaccino doesn't provide all the mocha command line switches as configuration options, you can still set these in a [mocha.opts file](http://visionmedia.github.io/mocha/#mocha.opts) if you wish. The example in <em>test/functional/</em> shows how to do this (see the <em>test/mocha.opts</em> file inside this example, which turns off color for the reports on the console).

Note that grunt-mochaccino is a multi-task, so you can configure it to run unit tests separately from integration tests etc.

## Options

### files

type: [grunt file spec](http://gruntjs.com/configuring-tasks#files), mandatory

Specifies the test files to run with mocha.

### cmd

type: string, default: <code>MOCHA</code> environment variable, if set; if not, "mocha"

The mocha command to run. Should either be on your path (e.g. "mocha") or an absolute path (e.g. "/home/bilbo/bin/mocha").

### reporter

type: string, default: "dot"

The mocha reporter to use. Note that if you're using fancy reporters, you will need to install them into your project yourself.

Using the "html-cov" reporter exposes more options to do with generating a coverage report (see below).

### reportDir

type: string, default: "."

The directory to output coverage reports to.

### browserCmd

type: string, default: null

Command to start a browser from the command line.

If set, and reporter == "html-cov", grunt-mochaccino will attempt to open the generated coverage report using this browser command.

Note that the command is fed directly to the command line, so you need to either specify an absolute path (e.g. "/home/bilbo/bin/google-chrome") or a command on your path (e.g. "google-chrome", "firefox").

### blanket

type: string, default: 'blanket'

The path to the [blanket](http://blanketjs.org/) node module. In most contexts, the default should be OK, but you may need to set it manually if you're running tests from a subdirectory (as is the case with grunt-mochaccino's own tests; see <em>test/functional/Gruntfile.js</em>).

See [Producing coverage reports](#coverage) for more details about coverage reporting.

# <a name="coverage"></a>Producing coverage reports

This plugin will also write coverage reports to a configurable directory. To use this functionality you will need to do the following in your project:

1.  Install blanket:

        npm install blanket --save-dev

    Note that I've tested this on my own projects with the current development version of blanket.

2.  Configure blanket in <em>package.json</em> by adding a <code>blanket</code> property to the the <code>scripts</code> object. For example, if your project is in the <em>myproject</em> directory, and the source under test is in <em>myproject/src</em>, your <em>package.json</em> should look something like this:

        {
          "name": "myproject",
          "scripts": {
            "blanket": {
              "pattern": "myproject/src/"
            }
          },
          ... more properties ...
        }

    Note the slightly counter-intuitive <code>"myproject/src"</code>. This is because blanket compares the paths of files imported by <code>require()</code> against this pattern: if you just use <code>"src"</code> as the pattern, you might find that blanket produces coverage statistics for other <code>src</code> directories in your project (e.g. inside <em>node_modules</em>).

3.  In your mochaccino task configuration in <em>Gruntfile.js</em>, set the reporter to <code>'html-cov'</code>:

        grunt.initConfig({
          // ... other task configuration ...

          mochaccino: {
            cov: {
              files: [
                { src: 'test/unit/*.test.js' },
                { src: 'test/integration/*.test.js' }
              ],
              reporter: 'html-cov',
              reportDir: 'build',
              browserCmd: 'google-chrome'
            }
          }
        });

    grunt-mochaccino uses standard grunt file sources, so you can set the <code>files</code> property how you like. The example above shows how to configure a coverage task <code>mochaccino:cov</code> for the <em>test/unit/</em> and <em>test/integration/</em> directories.

    <code>browserCmd</code> is an optional property specifying the command to start a browser in your environment. If set, grunt-mochaccino will open the browser with the path to the generated coverage report.

4.  Run the task. With the above configuration, you'd do:

        grunt mochaccino:cov

    The output should look something like this (this example is extracted from [grunt-tizen](http://github.com/01org/grunt-tizen)):

        looking for tasks in /home/ell/dev/js/grunt-tasks/grunt-tizen/node_modules/grunt-mochaccino/tasks
        Running "mochaccino:cov" (mochaccino) task
        >> mocha command: mocha -R html-cov --require blanket test/unit/bridge.test.js test/unit/file-lister.test.js test/unit/tizen-config.test.js test/unit/tizen-tasks.test.js test/integration/tizen-config-maker.test.js
        >> coverage report is available at build/cov-2013-06-28_145716.html

        Done, without errors.

     The report filenames use the convention <em>&lt;reportDir&gt;/cov-&lt;timestamp&gt;.html</em>.
