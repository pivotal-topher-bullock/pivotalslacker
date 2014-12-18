(function () {
  'use strict';
  var selected, selectedObj;

  chrome.runtime.onMessage.addListener( function(request) {
    var obj, $el,
        $ = window.$,
        chrome = window.chrome;

    if(!request.action || request.action!== 'PScopyStories'){
      return;
    }

    selected = [];
    selectedObj = window.$('.selected').parent().parent();
    
    selectedObj.each(function(id, el) {
      $el = $(el);
      obj = {
        id : $el.attr('data-id'),
        name : $el.find('.story_name').html(),
        points : $el.find('.preview .meta span').html()
      };

      selected.push(obj);

    });

    chrome.runtime.sendMessage(selected);

  });
}());