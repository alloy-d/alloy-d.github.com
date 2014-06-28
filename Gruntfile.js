module.exports = function (grunt) {
  grunt.initConfig({
    package: grunt.file.readJSON("package.json"),
    stylus: {
      compile: {
        files: {
          'css/home.css': '_styl/home.styl' // 1:1 compile
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-stylus");

  grunt.registerTask("build-parser", function () {
    var fs   = require("fs");
    var path = require("path");
    var PEG  = require("pegjs");

    var done = this.async();

    var modulify = function (source) {
      return [
        "(function (root, maker) {",
          "if (typeof(define) === 'function' && define.amd) {",
            "define(maker);",
          "} else if (typeof(exports) === 'object') {",
            "module.exports = maker();",
          "} else {",
            "root.AutomatonRuleParser = maker();",
          "}",
        "}(this, function () {",
          "return " + source + ";",
        "}));"
      ].join("\n");
    };
    fs.readFile(path.join("js", "automaton", "rule-parser.pegjs"), "utf8", function (err, text) {
      var parserSource;

      if (err) { grunt.fail.fatal(err) };

      parserSource = PEG.buildParser(text, {output: "source"});

      fs.writeFile(path.join("js", "automaton", "rule-parser.js"), modulify(parserSource.toSource()), function (err) {
        if (err) { grunt.fail.fatal(err) };
        done();
      });
    });
  });

  grunt.registerTask("default", ["build-parser"]);
};