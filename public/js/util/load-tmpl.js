define(['text', 'jquery'], function(text, $) {

  var defaults = {
    path     : '../tmpl/',
    ext      : '.html',
    idSuffix : 'Tmpl',
    container: 'body'
  };

  return {
    load: function(name, req, onLoad, config) {

      var filename = config.baseUrl + defaults.path + name + defaults.ext,
          tmplId   = name + defaults.idSuffix;

      text.get(filename, function(tmplString){
        $(defaults.container).append('<script id="' + tmplId + '" type="text/html">' + tmplString + '</script>');
        onLoad(tmplId);
      });
    }
  };

});