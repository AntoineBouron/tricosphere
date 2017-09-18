module.exports = function(grunt) {

    var jsSrc = [
        'app/app.module.js',
        'app/app.factory.js',
        'app/app.route.js',
        'app/app.directive.js',
        'app/app.service.js',
        'app/components/**/*.js',
        'app/shared/**/*.js'
    ];

    var cssSrc = [
        //'app/assets/css/bootstrap/*min.css',
        'app/assets/css/**/*.css',
        'app/assets/css/*.css',
        'app/assets/components/**/*.css',
        'app/shared/**/*.css'
    ];

    var viewsSrc = [
        'app/components/**/*.html'
    ];

    grunt.initConfig({

        // nettoyage des fichiers min
        clean: {
            cleanJs: {
                src: ['app/compiled/app.min.js']
            },
            cleanCss: {
                src: ['app/compiled/app.min.css']
            },
            cleanLibsJs: {
                src: ['app/compiled/libs.min.js']
            },
            cleanLibsCss: {
                src: ['app/compiled/libs.min.css']
            }
        },


        //
        concat: {
            options: {
                //separator: ';'
            },
            concatMyJsSrc: {
                src: jsSrc,
                dest: 'app/compiled/app.min.js'
            },
            concatMyCss: {
                src: cssSrc,
                dest: 'app/compiled/app.min.css'
            }
        },

        // 
        uglify: {
            options: {
                mangle: false,
                banner: '/*! Tricosphere */',
                sourceMap: true
            },
            uglifyMyJsSrc: {
                files: {
                    'app/compiled/app.min.js': ['app/compiled/app.min.js']
                }
            },
            bower: {
                files: {
                    'app/compiled/libs.min.js': ['app/compiled/libs.min.js']
                }
            }
        },
        jshint: {
            srcBeforeConcat: jsSrc,
            srcAfterConcat: 'app/compiled/app.min.js',
            libsAfterconcat: 'app/compiled/libs.min.js'
        },

        // 
        watch: {
            js: {
                files: jsSrc,
                tasks: ['taskJs'],
                options: {
                    spawn: false
                },
            },
            css: {
                files: cssSrc,
                tasks: ['taskCss'],
                options: {
                    spawn: false
                },
            },
            views: {
                files: viewsSrc,
                tasks: ['htmllint:views'],
                options: {
                    spawn: false
                },
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'app/compiled/app.min.css': cssSrc
                }
            }
        },

        //
        htmllint: {
            views: {
                options: {
                    ignore: /attribute “ng-[a-z-]+” not allowed/
                },
                src: 'app/compentents/**/*.html'
            }
        },

        //
        bower_concat: {
            js: {
                dest: {
                    js: 'app/compiled/libs.min.js'
                },
                // ordre des depndences
                dependencies: {
                    'boostrap': ['jquery', 'tether'],
                    'a0-angular-storage': 'angular',
                    'angular-jwt': 'angular',
                    'angular-messages': 'angular',
                    'angular-ui-router': 'angular',
                    'angular-bootstrap': 'angular'
                }
            },
            css: {
                dest: {
                    css: 'app/compiled/libs.min.css'
                }
            }

        },

        // 
        concurrent: {
            dev: {
                //tasks: ['watch:js', 'watch:css', 'watch:views'],
                tasks: ['watch:js', 'watch:css'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-bower-concat');



    // list l'ensemble des taches à faire
    grunt.registerTask('taskCss', ['clean:cleanCss', 'concat:concatMyCss', 'cssmin']);

    grunt.registerTask('taskJs', ['clean:cleanJs', 'jshint:srcBeforeConcat', 'concat:concatMyJsSrc', 'jshint:srcAfterConcat']);

    grunt.registerTask('buildBower', ['clean:cleanLibs', 'bower_concat', 'jshint:libsAfterconcat']);

    grunt.registerTask('default', [
        // libs (js & css)
        'clean:cleanLibsJs', 'clean:cleanLibsCss', 'bower_concat:js', 'bower_concat:css',
        // js 
        'clean:cleanJs', 'jshint:srcBeforeConcat', 'concat:concatMyJsSrc', 'jshint:srcAfterConcat',
        // css
        //'clean:cleanCss', 'concat:concatMyCss', 'cssmin',
        'clean:cleanCss', 'cssmin',
        // watch js / css 
        'concurrent:dev'
    ]);
}
