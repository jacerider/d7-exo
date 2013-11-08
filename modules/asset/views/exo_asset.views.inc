<?php

/**
 * @file
 * Providing extra functionality for the Asset UI via views.
 */


/**
 * Implements hook_views_data()
 */
function exo_asset_views_data_alter(&$data) {
  // Browse fields
  $data['asset']['exo_asset_select'] = array(
    'field' => array(
      'title' => t('eXo Asset Select'),
      'help' => t('A selection element for eXo asset browser.'),
      'handler' => 'exo_asset_handler_asset_select_field',
    ),
  );
}
