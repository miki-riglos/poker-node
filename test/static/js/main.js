require.config({
    baseUrl: '../../public/js',

    paths: {
//      io      : '/socket.io/socket.io',
      knockout: 'ext/knockout-2.2.1',
      jquery  : 'ext/jquery-1.9.1.min',
      text    : 'ext/text',
      loadTmpl: 'util/load-tmpl'
    }
});

var tests = [
  '../../test/static/js/util/load-tmpl.spec'
];

require(tests, function() {
  window.mocha.run();
});