/*global describe, it, before, beforeEach, afterEach, after*/

define(['user/user', 'room/room-list'], function(User, RoomList) {

  describe('RoomList viewmodel', function() {
    var user,
        roomList;

    beforeEach(function() {
      user     = new User();
      roomList = new RoomList(user);
    });

    it('should add room', function(done) {
      user.name('miki');

      roomList.allRooms().should.have.lengthOf(0);

      roomList.allRooms.subscribe(function(newValue) {
        roomList.allRooms().should.have.lengthOf(1);
        done();
      });

      roomList.add();
    });

    it('should remove room', function(done) {
      user.name('miki');
      roomList.add();

      roomList.allRooms().should.have.lengthOf(1);

      roomList.allRooms.subscribe(function(newValue) {
        roomList.allRooms().should.have.lengthOf(0);
        done();
      });

      roomList.remove(roomList.allRooms()[0]);
    });

  });

});