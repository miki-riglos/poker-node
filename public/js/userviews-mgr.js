define(['knockout', 'user', 'registration'], function(ko, user, registration) {

  var userViewsMgr = {

    actions: [{
      name: 'Login',
      action: function() { userViewsMgr.activate('login'); },
      enable: ko.computed( function() {return !user.loggedIn();} )
    }, {
      name: 'Register',
      action: function() { userViewsMgr.activate('register'); },
      enable: ko.computed( function() {return !user.loggedIn();} )
    }, {
      name: 'Logout',
      action: function() { user.logout(); },
      enable: ko.computed( function() {return user.loggedIn();} )
    }],

    views: {
      'login'   : {templateId: 'loginTmpl',    viewModel: user},
      'register': {templateId: 'registerTmpl', viewModel: registration},
      'loggedin': {templateId: 'loggedinTmpl', viewModel: user}
    },

    activeView: ko.observable(),

    activate: function(viewName) {
      this.activeView(userViewsMgr.views[viewName]);
    }
  };

  // Update view after user login/logout
  user.loggedIn.subscribe(function(newValue) {
    if (newValue) {
      userViewsMgr.activate('loggedin');
    } else {
      userViewsMgr.activate('login');
    }
  });

  // Auto-login after registration
  registration.afterRegister = function(name, password) {
    user.name(name);
    user.password(password);
    user.loggedIn(true);
  };

  // Initial view
  userViewsMgr.activate('login');

  return userViewsMgr;
});