//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app/public/',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'components/card-search/card-search.component.spec.js',
      // 'components/card-search/card-search.component.js',
      'components/deck-builder/deck-builder.module.js',
      'components/card-search/card-search.module.js',
      'js/services.js',
      'js/app.module.js',
      'js/app.config.js',
      'view*/**/*.js',
      'js/Chart.min.js',
      '../angular-chart.js/dist/angular-chart.js'
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
