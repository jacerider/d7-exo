CKEDITOR.plugins.add "exo_link",
  icons: "exo_link"

  init: (editor) ->
    editor.addCommand "exoLink",
      exec: (editor) ->
        timestamp = new Date()
        editor.insertHtml "The current date and time is: <em>" + timestamp.toString() + "</em>"

    editor.ui.addButton 'ExoLink',
      label: 'Link',
      command: 'exoLink',
      toolbar: 'insert',
      icon: @path + "/icons/exo_link.png"

