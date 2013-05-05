define(['knockout', 'user/user', 'user/registration', 'loadTmpl!user/login', 'loadTmpl!user/register', 'loadTmpl!user/logged-in'],
function(ko, User, Registration, loginTmplId, registerTmplId, loggedInTmplId) {

  function UserViewManager() {
    var self = this;

    self.user         = new User();
    self.registration = new Registration();

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

    self.activeView = ko.observable();

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
    self.registration.afterRegister = function(name, password) {
      self.user.name(name);
      self.user.password(password);
      self.user.isLoggedIn(true);
    };

    // Initial view
    self.activate('login');
  }

  return UserViewManager;
});