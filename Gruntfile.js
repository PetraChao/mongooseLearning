// 每一份 Gruntfile （和grunt插件）都遵循同样的格式，你所书写的Grunt代码必须放在此函数内：
module.exports = function(grunt) {
  // Do grunt-related things in here

  grunt.initConfig({
    watch:{
        files:["views/**"],
        options:{
            livereload:true
        }
    },
    connect: {
        script:"app.js",
        options: {
            port: 5000,
            hostname: 'localhost'
          },
          dev: {
            options: {
                middleware: function (connect) {
                    return [
                    require('connect-livereload')()
                    ];
                }
            }
        }
    },
    nodemon: {
      dev: {
        script:"app.js",
        options:{
            middleware: function (connect) {
                    return [
                    require('connect-livereload')()
                    ];
                },
            env:{
                PORT:"3000"
            },
            cwd:__dirname
        }
      }
    }
  });

  //
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.option('force', true);

  grunt.registerTask('live', ['nodemon']);
  grunt.registerTask('default', ['watch']);

};