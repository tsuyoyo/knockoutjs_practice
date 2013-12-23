'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // configurable paths
    yeoman: {
      app: 'app',
      css: 'css',
      html: '.',
      dist: 'dist',
      images: 'images'
    },

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['<%= yeoman.app %>/**/*.js'],
        dest: 'dist/allsrc.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/allsrc_min.js'
      },
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      app: {
        options: {
          jshintrc: '<%= yeoman.app %>/.jshintrc'
        },
        src: ['<%= yeoman.app %>/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.app.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      livereload: {
        files: [
          '<%= yeoman.html %>/*.html',
          '<%= yeoman.app %>/*.js',
          '<%= yeoman.css %>/*.css',
        ],
        options: {
          livereload: true
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          name: 'config',
          mainConfigFile: '<%= yeoman.app %>/config.js',
          out: '<%= concat.dist.dest %>',
          optimize: 'none'
        }
      }
    },
    connect: {
      options: {
        port: 1234,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= yeoman.html %>'
          ]
        }
      },
      production: {
        options: {
          keepalive: true,
          port: 8000,
          middleware: function(connect, options) {
            return [
              // rewrite requirejs to the compiled version
              function(req, res, next) {
                if (req.url === '/components/requirejs/require.js') {
                  req.url = '/dist/require.min.js';
                }
                next();
              },
              connect.static(options.base),

            ];
          }
        }
      }
    },
    // 引き込んでいるbower componentを自動的にhtmlの中へ書く
    'bower-install': {
      target: {
        html: '<%= yeoman.html %>/index.html'
      }
    },
    'useminPrepare': {
      options: {
        root: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>'
      },
      html: ['<%= yeoman.dist %>/**/*.html']
    },
    // htmlファイルの中のjs/cssのパスを、minifyしたものへ置き換える
    'usemin': {
      options: {
        dirs: ['<%= yeoman.dist %>']
      },
      html: ['<%= yeoman.dist %>/**/*.html']
    },
    // minifyの対象外のファイルを、distへコピーする
    copy: {
      dist: {
        files: [
          {
            expand: true,
            // Allow patterns to match filenames starting with a period, 
            // even if the pattern does not explicitly have a period in that spot.
            dot: true,
            cwd: "./",
            dest: "dist/",
            src: [
              '<%= yeoman.html %>/bower_components/**/*', 
              '<%= yeoman.html %>/*.html', 
              '<%= yeoman.app %>/**/*.js',
              '<%= yeoman.css %>/**',
              '<%= yeoman.images %>/**'
            ],
            filter: "isFile"
          }
        ]
      },
      webappManifest: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: "./",
            dest: "dist/",
            src: [
              '<%= yeoman.html %>/manifest.webapp' 
            ],
            filter: "isFile"
          }
        ]
      }
    } 
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-copy');  

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'requirejs', 'concat', 'uglify']);
  grunt.registerTask('preview', ['connect:livereload', 'watch:livereload']);
  grunt.registerTask('preview-live', ['default', 'connect:production']);
  grunt.registerTask('jshint-check', ['jshint:app']);

  // FxOS用
  grunt.registerTask('fxos-app-debug', [
//    'bower-install', 
    'clean', 
    'copy:dist',
    'copy:webappManifest'
//    'useminPrepare', 
//    'concat', 
//    'uglify', 
//    'usemin',

  ]);
};
