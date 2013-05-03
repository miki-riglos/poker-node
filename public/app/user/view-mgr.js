define(['knockout', 'user/user', 'user/registration', 'loadTmpl!user/login', 'loadTmpl!user/register', 'loadTmpl!user/logged-in'],
function(ko, user, registration, loginTmplId, registerTmplId, loggedInTmplId) {

  var userViewMgr = {

    actions: [{
      name: 'Login',
      action: function() { userViewMgr.activate('login'); },
      enable: ko.computed( function() {return !user.isLoggedIn();} )
    }, {
      name: 'Register',
      action: function() { userViewMgr.activate('register'); },
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
      this.activeView(userViewMgr.views[viewName]);
    }
  };

  // Update view after user login/logout
  user.isLoggedIn.subscribe(function(newValue) {
    if (newValue) {
      userViewMgr.activate('loggedIn');
    } else {
      userViewMgr.activate('login');
    }
  });

  // Auto-login after registration
  registration.afterRegister = function(name, password) {
    user.name(name);
    user.password(password);
    user.isLoggedIn(true);
  };

  // Initial view
  userViewMgr.activate('login');

  return userViewMgr;
});