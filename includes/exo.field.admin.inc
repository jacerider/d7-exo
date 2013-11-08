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

  // Add the eXo settings to the field instance form.
  if ($allowed_field  && $allowed_widget) {
    exo_form_field_form($form, $form_state);
  }
}

/**
 * Mee configuration form.
 */
function exo_form_field_form(&$form, &$form_state){
  $instance = empty($form['#instance']) ? array() : $form['#instance'];

  $defaults = array();

  // Get defaults
  $default_values = !empty($instance['settings']['exo']['settings']) ? $instance['settings']['exo']['settings'] : $defaults;

  // Fieldset for eXo settings on this field instance.
  $form['instance']['settings']['exo'] = array(
    '#type' => 'fieldset',
    '#title' => t('eXo Editor'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
    '#id' => 'edit-instance-settings-exo',
  );
  $exo = &$form['instance']['settings']['exo'];

  // Enable eXo on this field instance.
  $exo['enable'] = array(
    '#type' => 'checkbox',
    '#title' => t('Enable eXo support'),
    '#default_value' => isset($instance['settings']['exo']['enable']) ? $instance['settings']['exo']['enable'] : 0,
  );

  $exo['settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Settings'),
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
    '#states' => array(
      'invisible' => array(
        'input[name="instance[settings][exo][enable]"]' => array('checked' => FALSE),
      ),
    ),
  );

  $options = array(0 => '-- Allow All --');
  foreach(filter_formats() as $format){
    if($format->status) $options[$format->format] = $format->name;
  }
  $exo['settings']['text_format'] = array(
    '#type' => 'select',
    '#title' => t('Text format'),
    '#options' => $options,
    '#default_value' => isset($default_values['text_format']) ? $default_values['text_format'] : 0,
  );

  $options = array(
    // 'halloblock' => t('Block'),
    'halloheadings' => t('Headings'),
    'halloformat' => '<i class="fa fa-bold"></i> <i class="fa fa-italic"></i> ' . t('Format'),
    'hallolists' => '<i class="fa fa-list-ol"></i> <i class="fa fa-list-ul"></i> ' . t('Lists'),
    'hallojustify' => '<i class="fa fa-align-left"></i> <i class="fa fa-align-center"></i> <i class="fa fa-align-right"></i> ' . t('Justify'),
    'exolink' => '<i class="fa fa-link"></i> ' . t('Link'),
    'exoindent' => '<i class="fa fa-indent"></i> <i class="fa fa-dedent"></i> ' . t('Indent'),
    'halloreundo' => '<i class="fa fa-undo"></i> <i class="fa fa-repeat"></i> ' . t('Redo/Undo'),
  );
  $exo['settings']['pluginsHallo'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Editor Plugins'),
    '#options' => $options,
    '#default_value' => isset($default_values['pluginsHallo']) ? $default_values['pluginsHallo'] : array(),
  );

  drupal_alter('exo_settings_form', $exo, $default_values);

}
