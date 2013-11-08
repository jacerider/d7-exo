#     eXo - a rich text editor of awesomeness
#     (c) 2013 Cyle Carlson, Ashen Rayne
#     eXo may be freely distributed under the MIT license

((jQuery) ->

  ################################################################
  # Drupal AJAX command for inserting content into a pane.
  ################################################################
  Drupal.ajax::commands.exoPane = (ajax, response, status) ->
    $wrapper = jQuery('#exo-body')
    options =
      ajax: ajax
      response: response
      status: status
    jQuery($wrapper)['exoPane'] options
    $wrapper.exoPane unless !$wrapper.length


  ################################################################
  # Drupal AJAX command for hiding the pane.
  ################################################################
  Drupal.ajax::commands.exoPaneHide = (ajax, response, status) ->
    $wrapper = jQuery('#exo-body')
    $wrapper.exoPane 'destroy' unless !jQuery('#exo-pane').length




  ################################################################
  # eXo | Pane Widget
  ################################################################
  jQuery.widget "EXO.exoPane",
    paneWrapper: null
    pane: null
    options:
      ajax: null
      response: null
      status: null


    ##############################################################
    # eXo Pane | Creation
    ##############################################################
    _create: () ->
      @element.addClass 'exo-pane-active'
      @paneWrapper = jQuery('#exo-pane-wrapper')
      @paneWrapper.click(@_clickWrapper.bind(this))
      @pane = jQuery('#exo-pane')


    ##############################################################
    # eXo Pane | Initialize
    ##############################################################
    _init: () ->
      @pane.html(@options.response.data)

      jQuery('.exo-pane-close', @pane)
        .click(@_clickClose.bind(this))

      setTimeout =>
        @element.addClass 'exo-pane-open'

        # Apply any settings from the returned JSON if available.
        settings = @options.response.settings || @options.ajax.settings || Drupal.settings;
        Drupal.attachBehaviors(@pane, settings);
      , 10


    ##############################################################
    # eXo Pane | Destory
    ##############################################################
    destroy: () ->
      @element.removeClass 'exo-pane-open'

      setTimeout =>
        @element.removeClass 'exo-pane-active'
        @pane.html ''
        jQuery.Widget::destroy.call @
      , 300


    ##############################################################
    # Close pane if wrapper is clicked.
    ##############################################################
    _clickWrapper: (event) ->
      @destroy() if jQuery(event.target).attr('id') is 'exo-pane-wrapper'


    ##############################################################
    # Click the close button.
    ##############################################################
    _clickClose: (event) ->
      event.preventDefault()
      @destroy()


)(jQuery)
