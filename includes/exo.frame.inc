<?php

function exo_frame_view(){
  return '';
}

function exo_deliver_html_page($page) {
  // Render the page so that we get all the JS and CSS
  drupal_render_page($page);
  exo_frame_add_js();

  // Invoke hook_exo_frame
  module_invoke_all('exo_frame');

  print theme('exo_frame');
  drupal_exit();
}
