module.exports = function(grunt) {

  var buildFolder = '../build/';

  var jadedebug = {
    compileDebug: false,
    pretty: true,

    data:{
      partial: function(templatePath, dataObj){
        var template = grunt.file.read(templatePath);

        if(typeof(dataObj) === String){
          dataObj = grunt.file.readJSON(dataObj);
        }

        if(templatePath.match(/.jade/g)){
          return require('grunt-contrib-jade/node_modules/jade').compile(template, {filename: templatePath, pretty: true})(dataObj);
        }else{
          return template;
        }
      },
      data: function(path){
        return grunt.file.readJSON(path);
      },
      locals:{
        getConfigFile:function(path){
          return grunt.file.readJSON(path);
        },
        data: function(path){
          return jadedebug.data.data(path);
        },
        partial: function(templatePath, dataObj){
          return jadedebug.data.partial(templatePath, dataObj);
        }

      }
    }
  }


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // compile SASS files
    compass: {
      build: {
        options: {
          sassDir: 'style',
          cssDir: buildFolder+'style',
          outputStyle: 'compressed',
          // outputStyle: 'expanded',
          noLineComments: true,
          force: true,
          relativeAssets: true,
        }
      }
    },


    // copy files (font, img, js)
    copy: {
      // font: {
      //   files: [{expand: true, cwd: 'style/fonts', src:['**'], dest: buildFolder+'style/fonts'}]
      // },
      img: {
        files : [{expand: true, cwd: 'img', src: ['**'], dest: buildFolder+'img'}]
      },
      data: {
        files : [{expand: true, cwd: 'data', src: ['**'], dest: buildFolder+'data'}]
      },
      js: {
        files : [{expand: true, cwd: 'js', src: ['**'], dest: buildFolder+'js'}]
      },
      fonts:{
        files : [{expand: true, cwd: 'fonts', src: ['**'], dest: buildFolder+'fonts'}]
      }
    },


    // compile jade files
    jade: {
      index: {
        options: jadedebug,
        files: [{expand: true, cwd: './', src: ['*.jade'], dest: buildFolder, ext: '.html', flatten: true }]
      }
    },


    // watch file changes
    watch: {
      sass: {
        files: ['style/*.scss','style/**/*.scss'],
        tasks: ['compass:build']
      },
      jade: {
        files: ['*.jade'],
        tasks: ['jade:index']
      },
      img: {
        files: ['img/*.*', 'img/**/*.*'],
        tasks: ['copy:img']
      },
      data: {
        files: ['data/*.*'],
        tasks: ['copy:data']
      },
      js:{
        files: ['js/*.js', 'js/**/*.js'],
        tasks: ['copy:js']
      }
    }

    // yui compression
    // min: {
    //   dist: {
    //     src: ['../build/debug/js/main.js', '../build/debug/js/modules/*.js'],
    //     dest: '../build/debug/js/main.min.js'
    //   }
    // },
    // cssmin: {
    //   dist: {
    //     src: ['../build/debug/style/style.css', '../build/debug/style/modules/*.css'],
    //     dest: '../build/debug/style/style.min.css'
    //   }
    // }

  });



  // Load the plugins
  // ===================================
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-yui-compressor');




  // Default task(s)
  // ===================================
  grunt.registerTask('default', ['debug']);

  grunt.registerTask('debug', function() {
    grunt.task.run([
      'compass:build',
      'copy:img',
      'copy:data',
      'copy:js',
      'jade:index',
    ]);
  });

};