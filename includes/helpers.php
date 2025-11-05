<?php

function cm_get_post_card( $post ) {
    $post = get_post( $post );
    if ( ! $post ) return '';

    $title   = get_the_title( $post );
    $excerpt = get_the_excerpt( $post );
    $link    = get_permalink( $post );

    // Featured image (with fallback)
    $featured = get_the_post_thumbnail_url( $post, 'medium' );
    if ( ! $featured ) {
        $featured = "https://placehold.co/600x400?text=No+Image";
    }

    $author_id  = $post->post_author;
    $author_url = get_author_posts_url($author_id);
    $author_name = get_the_author_meta('display_name', $author_id);
    $avatar = get_avatar_url($author_id, ['size' => 24]);



    $html  = '<article class="post-card bg-white rounded-lg shadow-md p-4 transition duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer">';
    $html .= "<img src='{$featured}' alt='{$title}' class='w-full h-48 object-cover rounded-lg mb-3'>";
    $html .= "<h2 class='text-xl font-semibold mb-2'>{$title}</h2>";
    $html .= "<p class='text-gray-600 text-sm mb-3'>{$excerpt}</p>";
    $html .= "<a class='text-blue-600 text-sm font-semibold underline' href='{$link}'>Read more</a>";
    $html .= "<div class='flex items-center text-sm pt-2'>
            <a href='{$author_url}' class='mr-2'>{$author_name}</a>
            <img src='{$avatar}' class='w-6 h-6 rounded-full'>
          </div>";
    $html .= '</article>';

    return $html;
}
