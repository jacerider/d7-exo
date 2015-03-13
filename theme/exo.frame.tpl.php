<!DOCTYPE html>
<html id="exo-html">
  <head>
    <meta charset="utf-8" />
    <title></title>
    <?php print $styles; ?>
    <?php print $js; ?>
    <?php print $settings; ?>
  </head>
  <body id="exo-body" class="exo-frame-body">
    <div id="exo-perspective">
      <div id="exo-pane" class="page"></div>
      <div id="exo-wrapper">
        <div id="exo-instance">
          <div id="exo-messages"><?php print $messages; ?></div>
          <div id="exo-content"></div>
          <a id="exo-finish" href="#" class="exo"><i class="fa fa-save"></i> Finish Editing</a>
        </div>
      </div>
    </div>
  </body>
</html>
