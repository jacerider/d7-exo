/*
* eXo - text editor of awesomeness for Drupal
* by JaceRider and contributors. Available under the MIT license.
* See http://ashenrayne.com for more information
*
* Hallo 1.0.4 - rich text editor for jQuery UI
* by Henri Bergius and contributors. Available under the MIT license.
* See http://hallojs.org for more information
*/
(function() {
  CKEDITOR.plugins.add("exo_asset", {
    requires: "widget",
    icons: "exo_asset",
    init: function(editor) {
      editor.on('contentDom', function(event) {
        return editor.document.on('drop', function(event) {
          var asset;
          try {
            event.data.$.dataTransfer.getData('text/html');
          } catch (_error) {
            asset = event.data.$.dataTransfer.getData('Text');
            if (asset) {
              editor.insertHtml(asset);
              event.data.preventDefault();
            }
          }
          return setTimeout(function() {
            editor.mode = 'source';
            return editor.setMode('wysiwyg');
          }, 0);
        });
      });
      return editor.widgets.add("exo_asset", {
        button: "Create a simple box",
        allowedContent: "div(!exo-asset); div(!exo-asset-content); h2(!exo-asset-title)",
        requiredContent: "div(exo-asset)",
        upcast: function(element) {
          return element.name === "div" && element.hasClass("exo-asset");
        },
        edit: function(event) {
          var $element, $wrapper, aid, base, element_settings, iid;
          $wrapper = jQuery(event.sender.wrapper.$);
          $element = jQuery('.exo-asset', $wrapper);
          aid = $element.attr('data-aid');
          iid = $element.attr('data-iid');
          base = $element.attr('id');
          element_settings = {
            url: "/exo/asset/" + aid + "/instance/" + iid + "/ajax",
            event: "onload",
            keypress: false,
            prevent: false,
            wrapper: base
          };
          Drupal.ajax[base] = new Drupal.ajax(base, $element, element_settings);
          return $element.trigger('onload').off('onload');
        },
        template: "<div class=\"exo-asset\">" + "<h2 class=\"exo-asset-title\">Title</h2>" + "<div class=\"exo-asset-content\"><p>Content...</p></div>" + "</div>"
      });
    }
  });

}).call(this);
