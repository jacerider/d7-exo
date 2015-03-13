<?php

/**
 * Menu callback for frame that will display editor.
 */
function exo_frame_view(){
  exo_frame_add_js();
  return '';
}

/**
 * Stripped down delivery of html.
 */
function exo_deliver_html_page($page) {
  // Render the page so that we get all the JS and CSS
  $page['#type'] = 'page';
  $page['#show_messages'] = FALSE;
  drupal_render_page($page);

  // Invoke hook_exo_frame
  module_invoke_all('exo_frame');

  print theme('exo_frame');
  drupal_exit();
}

/**
 * Menu callback that allows for ajax events on each instance request.
 */
function exo_frame_resources($entity_type, $entity_id, $field_name, $delta){
  exo_frame_add_js();
  $commands = array();
  $context = array(
    'entity_type' => $entity_type,
    'entity_id' => $entity_id,
    'field_name' => $field_name,
    'delta' => $delta,
  );
  drupal_alter('exo_frame_resources', $commands, $context);
  $page = array('#type' => 'ajax', '#commands' => $commands);
  ajax_deliver($page);
  drupal_exit();
}
