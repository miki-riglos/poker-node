define(['require', 'jquery'], function(require, $) {

  function loadTemplate(templateName) {
    require(['text!templates/' + templateName + '.html'], function(templateString) {
      $("body").append("<script id=\"" + templateName + "Tmpl\" type=\"text/html\">" + templateString + "<\/script>");
    });
  }

  return loadTemplate;
});