<?php

/**
 * Implements template_preprocess_exo_frame();
 */
function template_preprocess_exo_frame(&$vars){
  $vars['styles'] = drupal_get_css();
  $vars['js'] = drupal_get_js() . drupal_get_js('footer');
  $vars['settings'] = drupal_get_js('settings');
  $vars['messages'] = theme('status_messages');
}
