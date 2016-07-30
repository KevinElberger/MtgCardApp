//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app/',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-loader/angular-loader.js',
      'public/js/jquery-2.1.4.js',
      'public/js/bootstrap.js',
      'public/js/FileSaver.min.js',
      'public/js/Chart.min.js',
      'angular-chart.js/dist/angular-chart.js',
      'public/js/app.module.js',
      'public/js/app.config.js',
      'public/js/services.js',
      'public/components/card-search/card-search.module.js',
      'public/components/card-search/card-search.component.js',
      'public/components/card-search/card-search.template.html',
      'public/components/deck-builder/deck-builder.module.js',
      'public/components/deck-builder/deck-builder.component.js',
      'public/components/deck-builder/deck-builder.template.html',
      'public/components/card-search/card-search.component.spec.js',
      'public/components/deck-builder/deck-builder.component.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
