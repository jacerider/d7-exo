<?php

/**
 * Menu callback for settings form.
 */
function exo_settings($form, $form_state) {
  module_load_include('inc', 'exo', 'exo.field.admin');

  // $exo = exo_configuration_form(variable_get('exo'));
  $form['exo'] = exo_configuration_form(variable_get('exo'));

  $form['exo']['#title'] = 'Editor default settings';
  $form['exo']['#tree'] = TRUE;

  return system_settings_form($form);
}
