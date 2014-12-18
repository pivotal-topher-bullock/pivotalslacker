(function () {
  'use strict';

  //clarify dependant globals for JSHint
  var chrome = window.chrome,
      Handlebars = window.Handlebars,
      $ = window.$;


  function registerHelpers(Handlebars) {

    Handlebars.registerHelper('math', function(lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            '+': lvalue + rvalue,
            '-': lvalue - rvalue,
            '*': lvalue * rvalue,
            '/': lvalue / rvalue,
            '%': lvalue % rvalue
          }[operator];
      });
  }

  function compileTemplate() {
    window.template = Handlebars.compile('{{#each stories}}' + window.templateContent + '{{/each}}');
  }

  function setTemplateContent(templateText){
    window.templateContent = templateText;
    $('#copyArea').html(templateText);
    compileTemplate();
  }


  function setup() {

    $('#copyStories').click(function(){
      chrome.tabs.query({ active : true, url : 'https://www.pivotaltracker.com/*' }, function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'PScopyStories' });
        });
      });
    });

    chrome.runtime.onMessage.addListener( function(request) {
      var $copyArea = $('#copyArea');
      var $copyStories = $('#copyStories');

      if($copyArea.html() !== window.templateContent){
        setTemplateContent($copyArea.html());
      }

      $copyArea.html(window.template({ stories : request}));
      $copyArea.select();

      document.execCommand('copy');

      $copyArea.html(window.templateContent);

      $copyStories.html('Stories Copied!');
      $copyStories.select();
      setTimeout(function(){
        $copyStories.html('Copy Selected Stories');
      }, 250);
      
    });

  }

  // Run our kitten generation script as soon as the document's DOM is ready.
  document.addEventListener('DOMContentLoaded', function () {
    registerHelpers(window.Handlebars);
    setTemplateContent(document.getElementById('template').innerHTML);
    setup();
  });

}());

