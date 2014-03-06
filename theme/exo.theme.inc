<?php

/**
 * Implements template_preprocess_exo_frame();
 */
function template_preprocess_exo_frame(&$vars){
  $vars['top'] = '<script type="text/javascript">var CKEDITOR_BASEPATH = "'.base_path() . drupal_get_path('module', 'exo') . '/js/ckeditor/'.'"</script>';
  $vars['styles'] = drupal_get_css();
  $vars['js'] = drupal_get_js() . drupal_get_js('footer');
  $vars['settings'] = drupal_get_js('settings');
}
