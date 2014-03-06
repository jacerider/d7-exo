@Drupal.behaviors.exoLink =

  attach: (context, settings) ->

    jQuery('#exo-link-form', context).once ->
      $content = jQuery '#exo-content'
      editor = $content.exoFrame 'ckeditorGet'

      CKEDITOR.tools.callFunction editor._.exoLinkFormSetup, jQuery(this), editor


# Link Plugin
CKEDITOR.plugins.add "exo_link",
  icons: "exo_link"
  created: false

  init: (editor) ->
    version = parseInt(CKEDITOR.version)

    editor.addCommand "exoLink",
      exec: (editor) ->
        # timestamp = new Date()
        # editor.insertHtml "The current date and time is: <em>" + timestamp.toString() + "</em>"
        $element = jQuery editor.element.$

        if !@created
          @created = true
          base = $element.attr('id');
          element_settings =
            url: "/exo/link/ajax"
            event: "onload"
            keypress: false
            prevent: false
            wrapper: base

          Drupal.ajax[base] = new Drupal.ajax(base, $element, element_settings)

        # Trigger AJAX request
        $element.trigger('onload')

    editor.ui.addButton 'ExoLink',
      label: 'Link',
      command: 'exoLink',
      toolbar: 'insert',
      icon: @path + "/icons/exo_link.png"

    # Add a shortcut. Only CKeditor version 4 has this function.
    editor.setKeystroke CKEDITOR.CTRL + 76, "exo_link"  if version >= 4

    editor.on "doubleclick", (evt) ->
      delete evt.data.dialog

      element = CKEDITOR.plugins.link.getSelectedLink(editor) or evt.data.element
      unless element.isReadOnly()
        if element.is("a")
          editor.getSelection().selectElement element
          if version >= 4
            editor.commands.exoLink.exec()
          else editor._.commands.exoLink.exec()  if version is 3

    editor._.exoLinkFormSetup = CKEDITOR.tools.addFunction(formSetup, editor)



formSetup = (form, editor) ->

  submit = jQuery('.exo-link-save',  form).removeClass 'form-submit'
  title = jQuery('#exo-link-title', form)
  web = jQuery('#exo-link-web', form)
  defaultUrl = 'http://'

  selection = editor.getSelection()

  # If we have selected a link element, we what to grab its attributes
  # so we can inserten them into the Linkit form in the  dialog.
  selectedElement = CKEDITOR.plugins.link.getSelectedLink editor
  if selectedElement && selectedElement.hasAttribute('href')
    selection.selectElement selectedElement
  else
    selectedElement = null;

  # Lock the selecton for IE.
  if CKEDITOR.env.ie && typeof selection != 'undefined'
    selection.lock()

  if selectedElement
    $selected = jQuery selectedElement.$
    title.val $selected.text()
    web.focus()
    web.val $selected.attr 'href'
    submit.val 'Update Link'
  else
    title.val CKEDITOR.tools.trim(selection.getSelectedText())
    web.val defaultUrl
    title.focus()
    submit.val 'Insert Link'


  submit.on 'click', (event) ->

    event.preventDefault()

    selection = editor.getSelection()
    path = web.val()
    title = title.val()

    data =
      path: CKEDITOR.tools.trim(path)
      title: CKEDITOR.tools.trim(title)
      attributes: []

    # Browser need the "href" for copy/paste link to work. (CKEDITOR ISSUE #6641)
    data.attributes["data-cke-saved-href"] = data.path

    unless selectedElement

      # We have not selected any link element so lets create a new one.
      range = selection.getRanges(1)[0]
      if range.collapsed
        content = (if (data.title) then data.title else data.path)
        text = new CKEDITOR.dom.text(content, editor.document)
        range.insertNode text
        range.selectNodeContents text

      # Delete all attributes that are empty.
      data.attributes.href = data.path
      for name of data.attributes
        if data.attributes[name] then null else delete data.attributes[name]

      # Apply style.
      style = new CKEDITOR.style(
        element: "a"
        attributes: data.attributes
      )
      style.type = CKEDITOR.STYLE_INLINE
      style.applyToRange range
      range.select()

    else
      element = selectedElement
      # We are editing an existing link, so just overwrite the attributes.
      element.setAttribute "href", data.path
      element.setAttribute "data-cke-saved-href", data.path
      element.setText (if (data.title) then data.title else data.path)

      console.log element

      for name of data.attributes
        (if data.attributes[name] then element.setAttribute(name, data.attributes[name]) else element.removeAttribute(name))
      selection.selectElement element

    # Unlock the selection.
    selection.unlock()  if CKEDITOR.env.ie and typeof selection isnt "undefined"

    $wrapper = jQuery('#exo-body')
    $wrapper.exoPane 'destroy' unless !jQuery('#exo-pane').length

    return false

