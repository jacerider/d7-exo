<?php

class AssetInstanceHandler_Dragon extends AssetInstanceHandler_Abstract {

  public function defaults($settings){
    return array(
      'position' => 'center'
    );
  }

  public function instance_form(&$form, &$form_state, $settings, $defaults) {
    $form['position'] = array(
      '#type' => 'select',
      '#title' => t('Position'),
      '#required' => TRUE,
      '#options' => array(
        'center' => t('Center'),
        'left' => t('Left'),
        'right' => t('Right'),
      ),
      '#default_value' => !empty($defaults['position']) ? $defaults['position'] : 'center',
      // '#ajax' => array(
      //   'callback' => 'mee_asset_instance_form_preview_ajax',
      //   'wrapper' => 'asset-instance-form',
      //   'method' => 'replace',
      //   'effect' => 'none',
      // ),
    );
  }

  public function instance_render(&$vars, $settings, $config) {
    if(!empty($settings['position'])){
      $vars['classes_array'][] = 'asset-position-' . $settings['position'];
    }
  }

  public function instance_render_preview(&$vars, $settings, $config) {
    if(!empty($settings['position'])){
      $vars['classes_array'][] = 'asset-position-' . $settings['position'];
    }
    // if(!empty($settings['position'])){
    //   dsm($element);
    //   $class = 'asset-position-' . $settings['position'];
    //   $element['#prefix'] = '<div class="' . $class . ' clearfix">';
    //   $element['#suffix'] = '</div>';
    // }
  }

}
