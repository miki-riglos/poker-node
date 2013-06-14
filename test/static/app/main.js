require.config({
    baseUrl: '../../public/app',

    paths: {
      io        : '../../test/static/app/_setup/io-fake',
      knockout  : '../js/knockout-2.2.1',
      underscore: '../js/underscore-min',      
      jquery    : '../js/jquery-1.9.1.min',
      text      : '../js/text',
      loadTmpl  : 'util/load-tmpl'
    },
    
    shim: {
      underscore: {exports: '_'}
    }
});

var tests = [
  '../../test/static/app/util/load-tmpl.spec',
  '../../test/static/app/util/emitter.spec',
  '../../test/static/app/user/user.spec',
  '../../test/static/app/user/registration.spec',
  '../../test/static/app/user/view-mgr.spec',
  '../../test/static/app/room/room-list.spec'
];

require(tests, function() {

  window.mocha.globals(['$', 'jQuery']);

  if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
  } else {
    window.mocha.run();
  }
});
