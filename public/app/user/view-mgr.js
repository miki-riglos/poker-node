define(['knockout', 'user/user', 'user/registration', 'loadTmpl!user/login', 'loadTmpl!user/register', 'loadTmpl!user/logged-in'],
function(ko, user, registration, loginTmplId, registerTmplId, loggedInTmplId) {

  var userViewsMgr = {

    actions: [{
      name: 'Login',
      action: function() { userViewsMgr.activate('login'); },
      enable: ko.computed( function() {return !user.isLoggedIn();} )
    }, {
      name: 'Register',
      action: function() { userViewsMgr.activate('register'); },
      enable: ko.computed( function() {return !user.isLoggedIn();} )
    }, {
      name: 'Logout',
      action: function() { user.logout(); },
      enable: ko.computed( function() {return user.isLoggedIn();} )
    }],

    views: {
      'login'   : {templateId: loginTmplId,    viewModel: user},
      'register': {templateId: registerTmplId, viewModel: registration},
      'loggedIn': {templateId: loggedInTmplId, viewModel: user}
    },

    activeView: ko.observable(),

    activate: function(viewName) {
      this.activeView(userViewsMgr.views[viewName]);
    }
  };

  // Update view after user login/logout
  user.isLoggedIn.subscribe(function(newValue) {
    if (newValue) {
      userViewsMgr.activate('loggedIn');
    } else {
      userViewsMgr.activate('login');
    }
  });

  // Auto-login after registration
  registration.afterRegister = function(name, password) {
    user.name(name);
    user.password(password);
    user.isLoggedIn(true);
  };

  // Initial view
  userViewsMgr.activate('login');

  return userViewsMgr;
});