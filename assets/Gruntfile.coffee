module.exports = ->
  banner = """/*
 * eXo - text editor of awesomeness for Drupal
 * by JaceRider and contributors. Available under the MIT license.
 * See http://ashenrayne.com for more information
 *
 * Hallo <%= pkg.version %> - rich text editor for jQuery UI
 * by Henri Bergius and contributors. Available under the MIT license.
 * See http://hallojs.org for more information
*/

"""

  # Project configuration
  @initConfig
    pkg: @file.readJSON 'package.json'

    # Install dependencies
    bower:
      install: {}

    # CoffeeScript complication
    coffee:
      # core:
      #   expand: true
      #   src: ['**.coffee']
      #   dest: 'tmp/hallo'
      #   cwd: 'hallo'
      #   ext: '.js'
      # toolbar:
      #   expand: true
      #   src: ['**.coffee']
      #   dest: 'tmp/hallo/toolbar'
      #   cwd: 'hallo/toolbar'
      #   ext: '.js'
      # widgets:
      #   expand: true
      #   src: ['**.coffee']
      #   dest: 'tmp/hallo/widgets'
      #   cwd: 'hallo/widgets'
      #   ext: '.js'
      # plugins:
      #   expand: true
      #   src: ['**.coffee']
      #   dest: 'tmp/hallo/plugins'
      #   cwd: 'hallo/plugins'
      #   ext: '.js'
      # plugins_image:
      #   expand: true
      #   src: ['**.coffee']
      #   dest: 'tmp/hallo/plugins/image'
      #   cwd: 'hallo/plugins/image'
      #   ext: '.js'
      exo:
        expand: true
        src: ['**.coffee']
        dest: 'tmp/exo'
        cwd: 'exo'
        ext: '.js'
      exo_frame:
        expand: true
        src: ['**.coffee']
        dest: 'tmp/exo_frame'
        cwd: 'exo_frame'
        ext: '.js'
      exo_plugins:
        expand: true
        src: ['**.coffee']
        dest: 'tmp/exo_frame/plugins'
        cwd: 'exo_frame/plugins'
        ext: '.js'
      exo_widgets:
        expand: true
        src: ['**.coffee']
        dest: 'tmp/exo_frame/widgets'
        cwd: 'exo_frame/widgets'
        ext: '.js'
      exo_asset:
        expand: true
        src: ['**.coffee']
        dest: 'tmp/exo_asset'
        cwd: 'exo_asset'
        ext: '.js'
      exo_breakpoint:
        expand: true
        src: ['**.coffee']
        dest: 'tmp/exo_breakpoint'
        cwd: 'exo_breakpoint'
        ext: '.js'

    watch:
      full:
        files: ['*/*.coffee','*/*/*.coffee']
        tasks: 'build'

    # Build setup: concatenate source files
    concat:
      options:
        stripBanners: true
        banner: banner
      # full:
      #   src: [
      #     'tmp/hallo/*.js'
      #     'tmp/hallo/**/*.js'
      #     'tmp/hallo/**/**/*.js'
      #   ]
      #   dest: '../js/exo.hallo.js'
      exo:
        src: [
          'tmp/exo/*.js'
          'tmp/exo/**/*.js'
        ]
        dest: '../js/exo.js'
      exo_frame:
        src: [
          'tmp/exo_frame/*.js'
          'tmp/exo_frame/**/*.js'
        ]
        dest: '../js/exo.frame.js'
      exo_asset:
        src: [
          'tmp/exo_asset/*.js'
        ]
        dest: '../modules/asset/js/exo_asset.js'
      exo_breakpoint:
        src: [
          'tmp/exo_breakpoint/*.js'
        ]
        dest: '../modules/breakpoint/js/exo_breakpoint.js'

    # Remove tmp directory once builds are complete
    clean: ['tmp','exo/*.js','exo/*/*.js','exo_frame/*.js','exo_frame/*/*.js','exo_asset/*.js','exo_breakpoint/*.js','hallo/*.js','hallo/*/*.js']

    # JavaScript minification
    uglify:
      options:
        banner: banner
        report: 'min'
      full:
        files:
          # '../js/exo.hallo.min.js': ['../js/exo.hallo.js']
          '../js/exo.min.js': ['../js/exo.js']
          '../js/exo.frame.min.js': ['../js/exo.frame.js']
          '../modules/asset/js/exo_asset.min.js': ['../modules/asset/js/exo_asset.js']
          '../modules/breakpoint/js/exo_breakpoint.min.js': ['../modules/breakpoint/js/exo_breakpoint.js']

    # Coding standards verification
    coffeelint:
      full: [
        # 'hallo/*.coffee'
        # 'hallo/**/*.coffee'
        'exo/*.coffee'
        'exo/**/*.coffee'
        'exo_frame/*.coffee'
        'exo_asset/*.coffee'
        'exo_breakpoint/*.coffee'
      ]

    # Unit tests
    qunit:
      all: ['test/*.html']

    # Cross-browser testing
    connect:
      server:
        options:
          base: ''
          port: 9999

    'saucelabs-qunit':
      all:
        options:
          urls: ['http://127.0.0.1:9999/test/index.html']
          browsers: [
              browserName: 'chrome'
            ,
              browserName: 'safari'
              platform: 'OS X 10.8'
              version: '6'
          ]
          build: process.env.TRAVIS_JOB_ID
          testname: 'hallo.js cross-browser tests'
          tunnelTimeout: 5
          concurrency: 3
          detailedError: true

  # Dependency installation
  @loadNpmTasks 'grunt-bower-task'

  # Build dependencies
  @loadNpmTasks 'grunt-contrib-coffee'
  @loadNpmTasks 'grunt-contrib-watch'
  @loadNpmTasks 'grunt-contrib-concat'
  @loadNpmTasks 'grunt-contrib-clean'
  @loadNpmTasks 'grunt-contrib-uglify'

  # Testing dependencies
  @loadNpmTasks 'grunt-coffeelint'
  @loadNpmTasks 'grunt-contrib-jshint'
  @loadNpmTasks 'grunt-contrib-qunit'

  # Cross-browser testing
  @loadNpmTasks 'grunt-contrib-connect'
  @loadNpmTasks 'grunt-saucelabs'

  # Local tasks
  @registerTask 'build', ['coffee', 'concat', 'clean', 'uglify']
  @registerTask 'test', ['coffeelint', 'build', 'qunit']
  @registerTask 'crossbrowser', ['test', 'connect', 'saucelabs-qunit']
