define(['text', 'jquery'], function(text, $) {

  var defaults = {
    ext      : '.html',
    idSuffix : 'Tmpl',
    container: 'body'
  };

  return {
    load: function(name, req, onLoad, config) {

      var filename = config.baseUrl + name + defaults.ext,
          tmplId   = name.toLowerCase()
                         .split('/').join('_')
                         .replace(/-(.)/g, function(match, group1) { return group1.toUpperCase(); }) // remove dash and camelCase
                         + defaults.idSuffix;

      text.get(filename, function(tmplString){
        $(defaults.container).append('<script id="' + tmplId + '" type="text/html">' + tmplString + '</script>');
        onLoad(tmplId);
      });
    }
  };

});