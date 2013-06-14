define(['knockout', 'user/user', 'user/registration', 'loadTmpl!user/view-mgr', 'loadTmpl!user/login', 'loadTmpl!user/register', 'loadTmpl!user/logged-in'],
function(ko, User, Registration, viewMgrTmplId, loginTmplId, registerTmplId, loggedInTmplId) {

  function UserViewManager(user, registration) {
    var self = this;

    self.templateId = viewMgrTmplId;

    self.user         = user;
    self.registration = registration;
    
    self.activeView = ko.observable();

    self.actions = [{
      name: 'Login',
      action: function() { self.activate('login'); },
      enable: ko.computed( function() {return !self.user.isLoggedIn();} )
    }, {
      name: 'Register',
      action: function() { self.activate('register'); },
      enable: ko.computed( function() {return !self.user.isLoggedIn();} )
    }, {
      name: 'Logout',
      action: function() { self.user.logout(); },
      enable: ko.computed( function() {return self.user.isLoggedIn();} )
    }];

    self.views = {
      'login'   : {templateId: loginTmplId,    viewModel: self.user},
      'register': {templateId: registerTmplId, viewModel: self.registration},
      'loggedIn': {templateId: loggedInTmplId, viewModel: self.user}
    };

    self.activate = function(viewName) {
      self.activeView(self.views[viewName]);
    };

    // Update view after user login/logout
    self.user.isLoggedIn.subscribe(function(newValue) {
      if (newValue) {
        self.activate('loggedIn');
      } else {
        self.activate('login');
      }
    });

    // Auto-login after registration
    self.registration.afterRegister = function(name) {
      self.user.name(name);
      self.user.isLoggedIn(true);
    };

    // Initial view
    self.activate('login');
  }

  return UserViewManager;
});