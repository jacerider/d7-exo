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
  CKEDITOR.plugins.add("exo_link", {
    icons: "exo_link",
    init: function(editor) {
      editor.addCommand("exoLink", {
        exec: function(editor) {
          var timestamp;
          timestamp = new Date();
          return editor.insertHtml("The current date and time is: <em>" + timestamp.toString() + "</em>");
        }
      });
      return editor.ui.addButton('ExoLink', {
        label: 'Link',
        command: 'exoLink',
        toolbar: 'insert',
        icon: this.path + "/icons/exo_link.png"
      });
    }
  });

}).call(this);
