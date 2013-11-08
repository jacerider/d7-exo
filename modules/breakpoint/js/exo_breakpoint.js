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
  (function(jQuery) {
    return jQuery.widget("EXO.exoBreakpoint", {
      $exo: null,
      _create: function() {
        return this.$exo = this.options.$exo;
      },
      populateSidebar: function() {
        var $set, options;
        $set = jQuery("<div id=\"" + this.widgetName + "\" class=\"exo-button-wrapper\"></div>");
        options = {
          $exo: this.$exo,
          $sidebar: this.element,
          plugin: this,
          id: this.widgetName,
          label: 'Breakpoints',
          icon: 'mobile'
        };
        $set.exoSidebarButton(options);
        return $set.appendTo(this.element);
      },
      populateSidebarContent: function($content, options) {
        return $content.html('Soon you will be able to use this panel to preview your site via <strong>breakpoints</strong>.');
      }
    });
  })(jQuery);

}).call(this);
