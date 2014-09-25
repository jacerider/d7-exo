<?php

/**
 * Implements hook_form_FIELD_UI_FIELD_EDIT_FORM_alter().
 */
function exo_form_field_ui_field_edit_form_alter(&$form, &$form_state) {

  // Get allowed field and widget types.
  $allowed_field_types = exo_allowed_field_types();
  $allowed_field = in_array($form['#field']['type'], $allowed_field_types);
  $allowed_widget_types = exo_allowed_widget_types();
  $allowed_widget = in_array($form['instance']['widget']['type']['#value'], $allowed_widget_types);

  // Add the exo settings to the field instance form.
  if ($allowed_field  && $allowed_widget) {
    exo_form_field_form($form, $form_state);
  }
}

/**
 * Mee configuration form.
 */
function exo_form_field_form(&$form, &$form_state){
  $instance = empty($form['#instance']) ? array() : $form['#instance'];

  // Get defaults
  $default_values = !empty($instance['settings']['exo']['settings']) ? $instance['settings']['exo']['settings'] : array();

  // Fieldset for exo settings on this field instance.
  $form['instance']['settings']['exo'] = array(
    '#type' => 'fieldset',
    '#title' => t('eXo'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
    '#id' => 'edit-instance-settings-exo',
  );

  // Enable exo on this field instance.
  $form['instance']['settings']['exo']['status'] = array(
    '#type' => 'checkbox',
    '#title' => t('Enable eXo'),
    '#description' => t('eXo enhances the content creation experience.'),
    '#default_value' => isset($instance['settings']['exo']['status']) ? $instance['settings']['exo']['status'] : 0,
  );
}
