define(['knockout'], function(ko) {

  var Player = function(name, chips) {
    if (!(this instanceof Player)) return new Player(name, chips);
    this.name  = name;
    this.chips = chips;
  };

  var Table = function(host) {
    if (!(this instanceof Table)) return new Table(host);
    this.host    = ko.observable(host);
    this.players = ko.observableArray([]);
  };

  Table.prototype.addPlayer= function(name, chips) {
    this.players.push(Player(name, chips));
  };

  return Table;
});