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
      return editor.widgets.add("exo_asset", {
        button: "Create a simple box",
        allowedContent: "div(!exo-asset); div(!exo-asset-content); h2(!exo-asset-title)",
        requiredContent: "div(exo-asset)",
        upcast: function(element) {
          return element.name === "div" && element.hasClass("exo-asset");
        },
        edit: function(event) {
          var $element, aid, base, element_settings, iid;
          $element = jQuery(event.sender.element.$);
          aid = $element.attr('data-aid');
          iid = $element.attr('data-iid');
          base = $element.attr('id');
          element_settings = {
            url: "/exo/asset/" + aid + "/instance/" + iid + "/ajax",
            event: "onload",
            keypress: false,
            prevent: false,
            wrapper: base,
            progress: {
              type: "none"
            }
          };
          Drupal.ajax[base] = new Drupal.ajax(base, $element, element_settings);
          return $element.trigger('onload').off('onload');
        },
        template: "<div class=\"exo-asset\">" + "<h2 class=\"exo-asset-title\">Title</h2>" + "<div class=\"exo-asset-content\"><p>Content...</p></div>" + "</div>"
      });
    }
  });

}).call(this);
