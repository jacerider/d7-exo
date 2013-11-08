#     eXo - a rich text editor of awesomeness
#     (c) 2013 Cyle Carlson, Ashen Rayne
#     eXo may be freely distributed under the MIT license

((jQuery) ->
  jQuery.widget 'EXO.exoSidebar',
    $exo: null
    $active: null


    ##############################################################
    # eXo Sidebar | Creation
    ##############################################################
    _create: ->
      @$exo = @options.$exo
      @$sidebarWrapper = jQuery '#exo-sidebar-wrapper'

      # Activate plugins
      for plugin, options of @options.plugins
        options = {} unless jQuery.isPlainObject options
        jQuery.extend options,
          $exo: @$exo
        jQuery(@element)[plugin] options


    ##############################################################
    # eXo Sidebar | Initialization
    ##############################################################
    _init: ->
      # Populate sidebar
      for plugin of @options.plugins
        instance = @getPluginInstance(plugin)
        continue unless instance
        populate = instance.populateSidebar
        continue unless jQuery.isFunction populate
        @element[plugin] 'populateSidebar', this


    destroy: ->

      for plugin of @options.plugins
        jQuery(@element)[plugin] 'destroy'

      # Remove markup within sidebar.
      @element.html ''
      @$sidebarWrapper.removeClass 'active'

      jQuery.Widget::destroy.call @


    getPluginInstance: (plugin) ->
      # jQuery UI 1.10 or newer
      instance = jQuery(@element).data "EXO-#{plugin}"
      return instance if instance
      # Older jQuery UI
      instance = jQuery(@element).data plugin
      return instance if instance
      throw new Error "Plugin #{plugin} not found"

    setActive: (id) ->
      @$active = id
      @element.parent().addClass 'active'

    setInactive: ->
      @$active = false
      @element.parent().removeClass 'active'

    getActive: ->
      (if @$active then @$active else false)



  jQuery.widget 'EXO.exoSidebarButton',
    $exo: null
    $sidebar: null
    $content: null
    loaded: false

    options:
      id: @uuid
      label: null
      icon: null
      plugin: null


    ##############################################################
    # eXo Sidebar Button | Creation
    ##############################################################
    _create: ->
      @$exo = @options.$exo
      @$sidebar = @options.$sidebar
      @id = "exo-widget-#{@widgetName}-#{@options.id}"
      @_createButton @options.label, @options.icon

      # Generate supplemental content
      @_createContent() if jQuery.isFunction @options.plugin.populateSidebarContent


    _createButton: (label, icon) ->
      classes = [
        'exo-button'
        @id
      ]
      @$button = jQuery "<button id=\"#{@id}\"
        class=\"#{classes.join(' ')}\" title=\"#{label}\">
          <span class=\"ui-button-text\">
            <i class=\"fa fa-#{icon}\"></i> <span class=\"label\">#{label}<span>
          </span>
        </button>"

      @$button.appendTo(@element).click(@_click.bind(this))


    _click: (event) ->
      event.preventDefault()

      # Do we have sidebar content for this item?
      return unless jQuery.isFunction @options.plugin.populateSidebarContent

      #####################
      # Button Actions
      #####################
      active = @$sidebar.exoSidebar 'getActive'
      if @id is active
        jQuery("##{@id}", @$sidebar).removeClass 'active'
        jQuery("##{@id}-content", @$sidebar).removeClass 'active'
        @$content.parent().removeClass 'active'
        # Set inactive
        @$sidebar.exoSidebar 'setInactive'
      else
        jQuery("##{active}", @$sidebar).removeClass 'active' unless !active
        jQuery("##{active}-content", @$sidebar).parent().removeClass 'active' unless !active
        jQuery("##{@id}", @$sidebar).addClass 'active'
        @$content.parent().addClass 'active'
        # Record active
        @$sidebar.exoSidebar 'setActive', @id
        # Load in content
        @_setContent()


    _createContent: ->
      classes = [
        'exo-button-content'
      ]
      @$content = jQuery "<div id=\"#{@id}-content\" class=\"#{classes.join(' ')}\"></div>"
      @$content.appendTo(@element).wrap('<div class="exo-button-content-wrapper" />')


    _setContent: ->
      # If content is already loaded, we don't need to do anything.
      return if @loaded

      # Show content loader.
      @_showLoader()
      # Trigger content load.
      # @options.plugin.populateSidebarContent(@$content, @options)

      plugin = @options.plugin.widgetName
      # @element[plugin] 'populateSidebarContent', @content, @options

      instance = @$sidebar.exoSidebar 'getPluginInstance', plugin
      return unless instance
      populate = instance.populateSidebarContent
      return unless jQuery.isFunction populate
      @$sidebar[plugin] 'populateSidebarContent', @$content, @options

      @loaded = true


    _showLoader: ->
      @$content.html '<div class="exo-button-content-loader"><i class="fa fa-cog fa-spin fa-large"></i></div>'


) jQuery
