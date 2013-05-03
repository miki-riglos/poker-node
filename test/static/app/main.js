require.config({
    baseUrl: '../../public/app',

    paths: {
      io      : '../../test/static/app/_setup/io-fake',
      knockout: '../js/knockout-2.2.1',
      jquery  : '../js/jquery-1.9.1.min',
      text    : '../js/text',
      loadTmpl: 'util/load-tmpl'
    }
});

var tests = [
  '../../test/static/app/util/load-tmpl.spec',
  '../../test/static/app/user/user.spec'
];

require(tests, function() {

  window.mocha.globals(['$', 'jQuery']);

  if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
  } else {
    window.mocha.run();
  }
});
