<?php

/**
 * Menu callback for settings form.
 */
function exo_settings($form, $form_state) {
  module_load_include('inc', 'exo', 'includes/exo.fieldAdmin');

  $form['exo'] = exo_configuration_form();

  $form['exo']['#title'] = 'Editor default settings';
  $form['exo']['#tree'] = TRUE;

  return system_settings_form($form);
}
