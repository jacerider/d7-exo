#     eXo - a rich text editor of awesomeness
#     (c) 2013 Cyle Carlson, Ashen Rayne
#     eXo may be freely distributed under the MIT license

((jQuery) ->

  jQuery.exoFrame =

    enable: () ->
      jQuery('#exo-content').exoFrame()


  jQuery.widget 'EXO.exoFrame',
    parentOps: null
    $instance: null
    $contentWrapper: null
    $finish: null
    content: null

    options:
      id: null
      label: null
      plugins:{}
      pluginsHallo:{}

    _create: ->
      @$instance = jQuery '#exo-instance'
      @$contentWrapper = jQuery '#exo-content-wrapper'
      @$finish = jQuery '#exo-finish'
      @$sidebar = jQuery '#exo-sidebar'

      # Set click action
      @$finish
        .click(@disable.bind(this))

      @_loadCss()


    _init: () ->

      @parentOps = parent.jQuery.exo
      options =
        $exo: @element
        parent_class: ''
      @options = jQuery.extend options, @parentOps.options
      @$parent = @parentOps.selectors.$element
      @element.addClass @options.preview_class

      # Sidebar
      @$instance.removeAttr 'class'
      if @options.sidebar
        @$instance.addClass 'exo-has-sidebar'
      @$sidebar.exoSidebar(@options)

      # Set content.
      @content = @parentOps.content
      # Fire event
      @element.trigger
        type: "exoEnable"
        exo: @
        time: new Date()


      # @element.html(@content)

      # Turn off automatic editor creation first.
      # CKEDITOR.disableAutoInline = true;
      # CKEDITOR.inline( 'exo-content', {toolbar: 'Basic'} );

      ckconfig =
        extraPlugins: 'divarea,widget,exo_asset,exo_link'
        height: 'auto'

      CKEDITOR.config.toolbar = [
        ["Format"]
        ["Bold", "Italic", "-", "ExoLink", "Unlink"]
        ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "-", "Blockquote"]
        ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"]
        ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "-", "Undo", "Redo"]
        ["Source"]
        # ["Styles", "Format", "Font", "FontSize"],
        # "/",
        # ["Bold", "Italic", "Underline", "StrikeThrough", "-", "Undo", "Redo", "-", "Cut", "Copy", "Paste", "Find", "Replace", "-", "Outdent", "Indent", "-", "Print"],
        # "/",
        # ["NumberedList", "BulletedList", "-", "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"],
        # ["Image", "Table", "-", "Link", "Flash", "Smiley", "TextColor", "BGColor", "Source"]
      ]

      CKEDITOR.config.extraAllowedContent = 'div(*)[*]; img(*)[*]; a(*)[*]; i(*)';

      target = @element.get( 0 )
      @ckeditor = CKEDITOR.appendTo(target, ckconfig)
      @ckeditor.setData @content
      @ckeditor.on 'loaded', =>
        @ckeditor.focus()

        # We want to make sure top bar has resize room
        @ckeditorResize()
        jQuery(window).bind 'resize', (event) =>
          @ckeditorResize()

        # Enable Dragon
        if Modernizr.draganddrop
          @element.exoDragon({ckeditor:@ckeditor,sidebar:@$sidebar})

    ckeditorUpdate: ->
      @ckeditor.mode = 'source'
      @ckeditor.setMode 'wysiwyg'


    ckeditorGet: ->
      @ckeditor


    ckeditorResize: ->
      top = jQuery('.cke_top', '#exo-content');
      content = jQuery('.cke_contents', '#exo-content');
      content.css 'top', top.outerHeight()


    destroy: () ->

      # Disable Hallo editor
      # @element.hallo 'destroy'
      @ckeditor.destroy()

      # Disable eXo sidebar
      @$sidebar.exoSidebar 'destroy'

      # Enable Dragon
      if Modernizr.draganddrop
        @element.exoDragon 'destroy'


    disable: (event) ->
      event.preventDefault()

      # Update changed content
      @content = jQuery('<div>' + @ckeditor.getData() + '</div>')

      # Fire event
      @element.trigger
        type: "exoDisable"
        exo: @
        time: new Date()
      parent.jQuery.exo.content = @_cleanSource()

      # Deselect the content editable field
      @element.blur()

      # Call parent disable
      @$parent.exo 'disable'

      # Wait for animation to finish before destroying.
      setTimeout @destroy.bind(this), 1000


    _cleanSource: () ->

      jQuery('[contentEditable]', @content).each ->
        inside = jQuery(this).html()
        jQuery(this).replaceWith inside

      @content.html().replace(/(\r\n|\n|\r)/gm, "")

    _loadCss: ->
      if parent.Drupal and parent.Drupal.settings and parent.Drupal.settings.exoInstance and parent.Drupal.settings.exoInstance.css
        for i, script of parent.Drupal.settings.exoInstance.css
          # Make sure file doesn't get loaded again in the future by Drupal
          Drupal.settings.ajaxPageState.css[script] = 1
          # Add CSS to header
          path = '<link media="screen" href="' + parent.Drupal.settings.basePath + script + '" rel="stylesheet" type="text/css">'
          jQuery('head').append path


)(jQuery)
