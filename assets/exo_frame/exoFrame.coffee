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
      @options = jQuery.extend options, @parentOps.options
      @$parent = @parentOps.selectors.$element

      # Sidebar
      @$instance.removeAttr 'class'
      if @options.sidebar
        @$instance.addClass 'exo-has-sidebar'
      @$sidebar.exoSidebar(@options)

      # Set content.
      @content = @parentOps.content
      # Fire event
      jQuery.event.trigger
        type: "exoEnable"
        exo: @
        time: new Date()
      @element.html(@content)

      # Enable Hallo editor
      @element.hallo
        editable: true
        plugins: @options.pluginsHallo
        parentElement: @$contentWrapper
        toolbarCssClass: 'exo-toolbar'
        toolbar: "halloToolbarFixed"

      # Enable Dragon
      if Modernizr.draganddrop
        @element.exoDragon()

      # Apply any settings from the returned JSON if available.
      settings = Drupal.settings;
      Drupal.attachBehaviors(@element, settings);

      @element.focus()


    destroy: () ->

      # Disable Hallo editor
      @element.hallo 'destroy'

      # Disable eXo sidebar
      @$sidebar.exoSidebar 'destroy'

      # Enable Dragon
      if Modernizr.draganddrop
        @element.exoDragon 'destroy'


    disable: (event) ->
      event.preventDefault()

      # Update changed content
      @content = @element
      # Fire event
      jQuery.event.trigger
        type: "exoDisable"
        exo: @
        time: new Date()
      parent.jQuery.exo.content = @content.html().replace(/(\r\n|\n|\r)/gm, "")

      # Deselect the content editable field
      @element.blur()

      # Call parent disable
      @$parent.exo 'disable'

      # Wait for animation to finish before destroying.
      setTimeout @destroy.bind(this), 1000


    _loadCss: ->
      if parent.Drupal and parent.Drupal.settings and parent.Drupal.settings.exoInstance and parent.Drupal.settings.exoInstance.css
        for i, script of parent.Drupal.settings.exoInstance.css
          # Make sure file doesn't get loaded again in the future by Drupal
          Drupal.settings.ajaxPageState.css[script] = 1
          # Add CSS to header
          path = '<link media="screen" href="' + parent.Drupal.settings.basePath + script + '" rel="stylesheet" type="text/css">'
          jQuery('head').append path




)(jQuery)
