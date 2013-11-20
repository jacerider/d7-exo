CKEDITOR.plugins.add "exo_asset",
  requires: "widget"
  icons: "exo_asset"

  init: (editor) ->

    editor.widgets.add "exo_asset",

      button: "Create a simple box"
      allowedContent: "div(!exo-asset); div(!exo-asset-content); h2(!exo-asset-title)"
      requiredContent: "div(exo-asset)"

      upcast: (element) ->
        element.name is "div" and element.hasClass("exo-asset")

      edit: (event) ->
        $element = jQuery(event.sender.element.$)
        aid = $element.attr 'data-aid'
        iid = $element.attr 'data-iid'

        # Load asset browser
        # Setup AJAX request
        base = $element.attr('id');
        element_settings =
          url: "/exo/asset/" + aid + "/instance/" + iid + "/ajax"
          event: "onload"
          keypress: false
          prevent: false
          wrapper: base
          progress:
            type: "none"

        Drupal.ajax[base] = new Drupal.ajax(base, $element, element_settings)

        # Trigger AJAX request
        $element.trigger('onload').off('onload')


      template: "<div class=\"exo-asset\">" + "<h2 class=\"exo-asset-title\">Title</h2>" + "<div class=\"exo-asset-content\"><p>Content...</p></div>" + "</div>"

