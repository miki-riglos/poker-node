define(['text', 'jquery'], function(text, $) {

  return {
    load: function(name, req, onLoad, config) {
      var tmplId = name + 'Tmpl';
      text.get(req.toUrl(name) + '.html', function(tmplString){
        $("body").append("<script id=\"" + tmplId + "Tmpl\" type=\"text/html\">" + tmplString + "<\/script>");
        onLoad(tmplId);
      });
    }
  };

});