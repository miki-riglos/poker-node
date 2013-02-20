require.config({
    paths: {
      knockout: 'ext/knockout-2.2.1',
      jquery  : 'ext/jquery-1.9.1.min'
    }
});

require(['knockout', 'jquery', 'table'], function(ko, $, Table) {
  var table = Table('miki');
  table.addPlayer('miki', 10000);

  ko.applyBindings(table);
});