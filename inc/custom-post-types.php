<?php
/**
 * Registers custom post types and taxonomies for the theme.
 *
 * @package nevechild
 */

// Create the project custom post type.
add_action( 'init', 'nevechild_create_cpt_project' );

/* Register the custom taxonomy needed for 'project-location' */
add_action( 'init', 'nevechild_create_projectlocation_taxonomy' );


/**
 * Defines the project custom post type
 *
 * @author Anthony Vickery-Hartnell <anthony@webassembler.co.uk>
 * @package WebAssembler
 * @since version 1.0
 */
function nevechild_create_cpt_project() {
	$labels = array(
		'name'               => 'Projects',
		'singular_name'      => 'Project',
		'add_new'            => 'Add New',
		'add_new_item'       => 'Add New Project',
		'edit_item'          => 'Edit Project',
		'new_item'           => 'New Project',
		'view_item'          => 'View Project',
		'search_items'       => 'Search Projects',
		'not_found'          => 'No projects found',
		'not_found_in_trash' => 'No Projects found in Trash',
		'parent_item_colon'  => '',
	);

	$args = array(
		'label'           => __( 'Projects' ),
		'labels'          => $labels,
		'public'          => true,
		'show_in_rest'    => true,
		'has_archive'     => false,
		'capability_type' => 'page',
		'hierarchical'    => true,
		'menu_icon'       => 'dashicons-portfolio',
		'supports'        => array( 'title', 'editor', 'page-attributes', 'thumbnail', 'slug', 'excerpt' ),
		'rewrite'         => array(
			'slug'      => 'projects',
			'withfront' => false,  // Defines URL base. 'Projects' page has been created.
		),
		'taxonomies'      => array( 'project-location' ),
	);

	register_post_type( 'project', $args );
}

/**
 * Create the custom taxonomy for the 'project' CPT.
 */
function nevechild_create_projectlocation_taxonomy() {

	$labels = array(
		'name'              => _x( 'Project location', 'taxonomy general name', 'hartnellgardens' ),
		'singular_name'     => _x( 'Project location', 'taxonomy singular name', 'hartnellgardens' ),
		'search_items'      => __( 'Search Project location', 'hartnellgardens' ),
		'all_items'         => __( 'All Project location', 'hartnellgardens' ),
		'parent_item'       => __( 'Parent Project location', 'hartnellgardens' ),
		'parent_item_colon' => __( 'Parent Project location:', 'hartnellgardens' ),
		'edit_item'         => __( 'Edit Project location', 'hartnellgardens' ),
		'update_item'       => __( 'Update Project location', 'hartnellgardens' ),
		'add_new_item'      => __( 'Add New Project location', 'hartnellgardens' ),
		'new_item_name'     => __( 'New Project location name', 'hartnellgardens' ),
		'menu_name'         => __( 'Project location', 'hartnellgardens' ),
	);

	$args = array(
		'hierarchical'      => true,
		'labels'            => $labels,
		'public'            => true,
		'show_ui'           => true,
		'show_admin_column' => true,
		'rewrite'           => false,
		'show_in_rest'      => true,
	);

	register_taxonomy(
		'project-location',
		'project',
		$args
	);
}
