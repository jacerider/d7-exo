#     eXo - a rich text editor of awesomeness
#     (c) 2013 Cyle Carlson, Ashen Rayne
#     eXo may be freely distributed under the MIT license

((jQuery) ->

  @Drupal.behaviors.exo =

    attach: (context, settings) ->

      return unless settings.exo

      self = this

      for i of settings.exo
        options = settings.exo[i]
        jQuery('#' + options.id).once().exo(options)


  jQuery.exo =
    created: false
    initialized: false
    selectors: {}
    content: null

  jQuery.widget 'EXO.exo',
    animateIn: 'pt-page-moveFromLeft pt-page-delay200'
    animateOut: 'pt-page-rotateLeftSideFirst'
    animEndEventNames:
      WebkitAnimation: "webkitAnimationEnd"
      OAnimation: "oAnimationEnd"
      msAnimation: "MSAnimationEnd"
      animation: "animationend"

    options:
      id: null
      label: null
      plugins:{}
      pluginsHallo:{}


    ##############################################################
    # eXo | Creation
    ##############################################################
    _create: ->

      if !jQuery.exo.created
        jQuery.exo.created = true

        jQuery('html').addClass('exo-exists')

        # Quickbar rebuilds itself on each ajax request. Dumb dumb dumb.
        delete Drupal.behaviors.quickbar if Drupal.behaviors.quickbar

        # We use a quick timeout to make sure any other dynamic elements that
        # get loaded onload have already been added.
        setTimeout =>
          jQuery('head').append("<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,300italic,700' rel='stylesheet' type='text/css'>")
          jQuery('body').wrapInner('<div id="exo-page" class="exo-page" />').wrapInner('<div id="exo-wrapper" />')
          @$exoPage = jQuery.exo.selectors.$exoPage =  jQuery('#exo-page')
          @$exoPage.data( 'originalClassList', @$exoPage.attr( 'class' ) ).addClass('exo-page-current')
          jQuery('html').addClass('exo-created')
        , 10


    ##############################################################
    # eXo | Initialization
    ##############################################################
    _init: ->

      @hideTextarea();

      $placeholder = jQuery('<a class="exo-placeholder" href="#" />')
      @element.after($placeholder)
      $placeholder
        .html( '<span><i class="fa fa-edit"></i> Edit <strong>' + ( @options.label ) + '</strong></span>' )
        .click(@enableClick.bind(this))


    ##############################################################
    # Click event handler that enable eXo instance.
    ##############################################################
    enableClick: (event) ->
      event.preventDefault()
      @enable()


    ##############################################################
    # Enable eXo instance
    ##############################################################
    enable: ->

      if jQuery.browser.msie
        r = confirm 'Your browser (Internet Explorer) is not support at this time. Please use Firefox, Chrome or Opera when administering content on this site. Would you like to download one of these browsers now?'
        if r is true
          alert 'You will now be redirected to a Better Browser...'
          window.location "http://abetterbrowser.org/"
        return

      if !jQuery.exo.initialized
        # Fired only one time for performance reasons
        jQuery.exo.initialized = true
        @initialize()

      else
        # Merge together global and local selectors
        for i, selector of jQuery.exo.selectors
          this[i] = selector

        # We need to store information that the frame can access.
        jQuery.exo.selectors.$element = @element
        jQuery.exo.options = @options

        # Trigger page swap
        @activePage @$exo, @animateIn, @animateOut

        # Put textarea into content area.
        jQuery.exo.content = @element.val()

        # Enable exo in frame
        @$main[0].contentWindow.jQuery.exoFrame.enable()


    ##############################################################
    # Initialize eXo for the first time on a page. This only happens once.
    ##############################################################
    initialize: ->
      $wrapper = jQuery('#exo-wrapper')

      @$loader = jQuery('<div id="exo-loading"><span class="fa-stack fa-2x"><i class="fa fa-square fa-stack-2x"></i><i class="fa fa-cog fa-spin fa-stack-1x fa-inverse"></i></span></div>')
      @$loader.appendTo($wrapper)

      @$exo = jQuery.exo.selectors.$exo = jQuery('<div id="exo" class="exo-page" />')
      @$exo.data( 'originalClassList', @$exo.attr( 'class' ) ).appendTo($wrapper)

      @$main = jQuery.exo.selectors.$main = jQuery('<iframe id="exo-main" src="/exo/frame"></iframe>')
      @$main.appendTo(@$exo).wrap('<div id="exo-main-wrapper" />')

      # Watch iFrame
      @watch()


    ##############################################################
    # Watch for iFrame to fully load.
    ##############################################################
    watch: ->
      @$frame = jQuery.exo.selectors.$frame = @$main.contents().find('#exo-content')
      if @$frame.length
        # Cleanup
        clearTimeout @watchTimer
        delete @watchTimer

        # Continue setup
        @$loader.remove()

        # iFrame has loaded. Continue enable.
        @enable()

      else
        @watchTimer = setTimeout =>
          @watch()
        , 100

    ##############################################################
    # Disable the eXo instance.
    ##############################################################
    disable: () ->

      # Put content area html into textarea.
      @element.val jQuery.exo.content

      # Trigger page swap
      @activePage @$exoPage, @animateIn, @animateOut


    ##############################################################
    # Handles the animation of global pages.
    ##############################################################
    activePage: ($selector, animateIn, animateOut) ->
      return false unless $selector.hasClass('exo-page')

      animEndEventName = @animEndEventNames[ Modernizr.prefixed( 'animation' ) ]
      @$exo.on(animEndEventName, @activePageFinish.bind(this))

      $selector.addClass('exo-page-current exo-page-ontop exo-focus ' + animateIn)
      jQuery('.exo-page:not(.exo-focus)').addClass(animateOut)

    ##############################################################
    # Fires after CSS transitions.
    ##############################################################
    activePageFinish: (event) ->
      # Remove binding
      animEndEventName = @animEndEventNames[ Modernizr.prefixed( 'animation' ) ]
      @$exo.off animEndEventName
      # Activate new page.
      $out = jQuery('.exo-page:not(.exo-focus)')
      $out.attr( 'class', $out.data( 'originalClassList' ) )
      $in = jQuery('.exo-focus')
      $in.attr( 'class', $in.data( 'originalClassList' ) + ' exo-page-current' )


    ##############################################################
    # Hide base textareas.
    ##############################################################
    hideTextarea: ->
      # @element.hide()



)(jQuery)
