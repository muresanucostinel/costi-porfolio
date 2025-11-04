<?php

function cm_theme_setup() {

  // 1️⃣ Add support for dynamic <title> tag
  add_theme_support( 'title-tag' );

  // 2️⃣ Enable Featured Images (Post Thumbnails)
  add_theme_support( 'post-thumbnails' );

  // 3️⃣ Enable custom logo support
  add_theme_support( 'custom-logo', array(
    'height'      => 80,
    'width'       => 200,
    'flex-height' => true,
    'flex-width'  => true,
  ) );

  // 4️⃣ Register a primary navigation menu
  register_nav_menus( array(
    'cm_primary_menu' => __( 'Primary Menu', 'costimuresanu' ),
  ) );

  // 5️⃣ Register sidebar / widget area
  register_sidebar( array(
    'name'          => __( 'Main Sidebar', 'costimuresanu' ),
    'id'            => 'cm_main_sidebar',
    'description'   => __( 'Widgets displayed in the main sidebar area', 'costimuresanu' ),
    'before_widget' => '<div id="%1$s" class="widget %2$s mb-6">',
    'after_widget'  => '</div>',
    'before_title'  => '<h3 class="widget-title text-lg font-semibold mb-3">',
    'after_title'   => '</h3>',
  ) );

  // 6️⃣ Enable HTML5 markup support for forms, galleries, etc.
  add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption' ) );
}
add_action( 'after_setup_theme', 'cm_theme_setup' );


/**
 * Enqueue scripts and styles in the correct order
 */

function costi_enqueue_assets() {
    // ============================
    // CSS Styling
    // ============================

    wp_enqueue_style(
        'costi-tailwind',
        get_template_directory_uri() . '/assets/css/output.css',
        [],
        null
    );

    wp_enqueue_style(
        'costi-style',
        get_template_directory_uri() . '/assets/css/style.css',
        [],
        null
    );

    // ============================
    // JavaScript Files
    // ============================

    // 1. Main logic + fetchPosts
    wp_enqueue_script(
        'costi-main-js',
        get_template_directory_uri() . '/assets/js/main.js',
        [],
        null,
        true
    );

    // 2. Load More button (defines loadPosts function)
    wp_enqueue_script(
        'costi-loadmore-js',
        get_template_directory_uri() . '/assets/js/loadMore.js',
        ['costi-main-js'], // ✅ depends on main
        null,
        true
    );

    // 3. Dropdowns UI
    wp_enqueue_script(
        'costi-dropdowns-js',
        get_template_directory_uri() . '/assets/js/dropdowns.js',
        ['costi-main-js'], // ✅ safe dependency
        null,
        true
    );

    // 4. Pagination Controller (MUST load after loadMore + dropdowns)
    wp_enqueue_script(
        'costi-pagination-js',
        get_template_directory_uri() . '/assets/js/paginationController.js',
        ['costi-loadmore-js', 'costi-dropdowns-js'], // ✅ sorted order
        null,
        true
    );
}
add_action('wp_enqueue_scripts', 'costi_enqueue_assets');
