<?php

/**
 * Menu callback for settings form.
 */
function exo_settings($form, $form_state) {
  module_load_include('inc', 'exo', 'exo.field.admin');

  // $exo = exo_configuration_form(variable_get('exo_defaults'));
  $form['exo_defaults'] = exo_configuration_form(variable_get('exo_defaults'));

  $form['exo_defaults']['#title'] = 'Editor default settings';
  $form['exo_defaults']['#tree'] = TRUE;

  return system_settings_form($form);
}

/**
 * Save configuration
 */
// function exo_settings_submit($form, &$form_state){
//   if($usage = exo_instance_usage(TRUE)){
//     if(@is_array($usage['Default'])){
//       foreach($usage['Default'] as $load_from => $name){
//         list($entity_type, $field_name, $bundle_name) = explode('|',$load_from);
//         $instance = field_info_instance($entity_type, $field_name, $bundle_name);
//         $instance['settings']['exo']['settings'] = $form_state['values']['exo_defaults'];
//         // Make sure default gets set again as we remove that field from the settings form
//         $instance['settings']['exo']['settings']['default'] = 1;
//         field_update_instance($instance);
//       }
//     }
//   }
// }
