<?php

add_action('rest_api_init', function () {
    register_rest_route('costi/v1', '/load-posts', [
        'methods'  => 'GET',
        'callback' => 'cm_rest_load_posts',
    ]);
});

function cm_rest_load_posts(WP_REST_Request $request) {
    $paged      = $request->get_param('page') ?: 1;
    $perPage    = $request->get_param('perPage') ?: 6;
    $categories = $request->get_param('categories');
    $tags       = $request->get_param('tags');

    $queryArgs = [
        'post_type'      => 'post',
        'posts_per_page' => $perPage,
        'paged'          => $paged,
    ];

    if ($categories) $queryArgs['category__in'] = explode(',', $categories);
    if ($tags)       $queryArgs['tag__in']      = explode(',', $tags);

    $query = new WP_Query($queryArgs);

    $html = '';
    foreach ($query->posts as $post) {
        $html .= cm_get_post_card($post);
    }

    return [
        'html'      => $html,
        'totalPages'=> $query->max_num_pages,
    ];
}
