<?php
/*
 * Plugin Name: EthicLibrary
 * Description: Basic logic implementation for interaction between html element
 * Author: Fabien Durousset
 * Version: 1.0
 * Author URI: https://github.com/Heavyl
*/
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
define( 'ETHIC_LIBRARY_VERSION', '1.2' );

function enqueue_plugin_scripts() {
    // Enqueue the main JavaScript file with module type
    wp_register_script(
        'ethic-library-main',
        plugins_url('/assets/js/main.js', __FILE__), 
        array(), 
        '1.0',
        true        
    );
    wp_enqueue_script('ethic-library-main');


    // Enqueue the main CSS file
    wp_register_style('ethic-library-init-style', plugins_url('/assets/css/style.css', __FILE__) , array(), '1.0');
    wp_enqueue_style('ethic-library-init-style');
}

add_action('wp_enqueue_scripts', 'enqueue_plugin_scripts');

// Add the module type to the script tag for the main JavaScript file
add_filter('script_loader_tag', function($tag, $handle, $src) {
    if ('ethic-library-main' === $handle) {
        $tag = '<script type="module" src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}, 10, 3);