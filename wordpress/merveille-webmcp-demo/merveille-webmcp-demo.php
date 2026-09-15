<?php
/**
 * Plugin Name: Merveille WebMCP Demo
 * Description: 管理員限定的 WebMCP 商品搜尋與真實購物車操作展示。
 * Version: 1.0.1
 * Author: Bruce Lee
 * Requires at least: 6.4
 * Requires PHP: 8.0
 * License: GPL-2.0-or-later
 */
if (!defined('ABSPATH')) { exit; }

function mwd_demo_active() {
    return isset($_GET['merveille_demo']) && '1' === $_GET['merveille_demo'] && current_user_can('manage_options');
}
add_action('admin_bar_menu', function ($bar) {
    if (current_user_can('manage_options')) {
        $bar->add_node(['id'=>'mwd-demo','title'=>'WebMCP Demo','href'=>add_query_arg('merveille_demo','1',home_url('/'))]);
    }
}, 100);
add_action('template_redirect', function () {
    if (mwd_demo_active()) {
        if (!defined('DONOTCACHEPAGE')) { define('DONOTCACHEPAGE', true); }
        nocache_headers();
    }
});
add_action('wp_enqueue_scripts', function () {
    if (!mwd_demo_active()) { return; }
    wp_enqueue_style('mwd-demo', plugins_url('assets/demo.css',__FILE__), [], '1.0.1');
    wp_enqueue_script('mwd-demo', plugins_url('assets/js/script.js',__FILE__), [], '1.0.1', true);
    wp_add_inline_script('mwd-demo','window.merveilleDemoConfig='.wp_json_encode([
        'api'=>rest_url('merveille-demo/v1/'), 'nonce'=>wp_create_nonce('wp_rest'),
        'cartUrl'=>function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/'),
    ]).';','before');
});
add_action('wp_footer', function () {
    if (!mwd_demo_active()) { return; }
    ?>
    <section id="mwd-demo" aria-label="Merveille WebMCP 操作展示">
      <header><div><small>WORDPRESS × WEBMCP · LIVE DEMO</small><h2>Merveille，讓 AI 幫你挑選。</h2></div><button id="mwd-toggle" type="button">收合</button></header>
      <div id="mwd-body">
        <p class="mwd-intro">搜尋真實商品 → 查看細節 → 加入目前購物車。最後由人決定是否結帳。</p>
        <div class="mwd-status" id="mwd-native" role="status">正在偵測 WebMCP…</div>
        <div class="mwd-layout"><div>
          <form id="mwd-search"><label>商品關鍵字<input id="mwd-query" value="耳環" maxlength="80"></label><label>最高金額<input id="mwd-price" type="number" min="0" step="1" value="500"></label><button type="submit">搜尋商品</button></form>
          <div id="mwd-products" aria-live="polite">搜尋後，商品會顯示在這裡。</div>
          <div id="mwd-detail" aria-live="polite"></div>
        </div><aside><h3>工具呼叫紀錄</h3><p class="mwd-muted">手動按鈕與 AI 使用相同操作；紀錄會標示來源。</p><ol id="mwd-log" aria-live="polite"></ol><button id="mwd-cart" type="button">查看目前購物車</button><div id="mwd-cart-result" aria-live="polite"></div></aside></div>
        <footer><button id="mwd-clean" type="button">移除本次 Demo 加入的商品</button><button id="mwd-copy" type="button">複製 AI 指令</button><span>管理員限定 · 真實商品 / 真實購物車 · 不建立訂單</span></footer>
      </div>
    </section>
    <?php
}, 10);

function mwd_product_data($p) {
    return ['id'=>$p->get_id(),'name'=>$p->get_name(),'price'=>$p->get_price(),
        'currency'=>get_woocommerce_currency(),'url'=>get_permalink($p->get_id()),
        'image'=>wp_get_attachment_image_url($p->get_image_id(),'woocommerce_thumbnail') ?: '',
        'description'=>wp_trim_words(wp_strip_all_tags($p->get_short_description() ?: $p->get_description()),70),
        'type'=>$p->get_type(),'in_stock'=>$p->is_in_stock(),
        'can_add'=>$p->is_type('simple') && $p->is_purchasable() && $p->is_in_stock()];
}
function mwd_public_product($id) {
    $p=wc_get_product($id);
    return $p && 'publish'===$p->get_status() && !$p->get_parent_id() && !post_password_required($id) && 'hidden'!==$p->get_catalog_visibility() ? $p : null;
}
function mwd_cart_data() {
    $items=[];
    foreach (WC()->cart->get_cart() as $key=>$item) {
        $items[]=['key'=>$key,'name'=>$item['data']->get_name(),'quantity'=>$item['quantity'],
            'demo'=>isset($item['merveille_demo_owner']) && get_current_user_id()===$item['merveille_demo_owner']];
    }
    return ['items'=>$items,'count'=>WC()->cart->get_cart_contents_count(),
        'total'=>html_entity_decode(wp_strip_all_tags(WC()->cart->get_cart_total()),ENT_QUOTES,'UTF-8'),
        'message'=>'購物車已更新，尚未建立訂單或付款。'];
}
function mwd_execute($request) {
    if (!function_exists('WC')) { return new WP_Error('missing_woocommerce','WooCommerce 尚未啟用。',['status'=>503]); }
    $action=$request['action'];
    if ('search'===$action) {
        $args=['post_type'=>'product','post_status'=>'publish','posts_per_page'=>6,'has_password'=>false,
            's'=>$request->get_param('query') ?: '', 'orderby'=>'title','order'=>'ASC'];
        $max=$request->get_param('max_price');
        if (null!==$max && ''!==$max) { $args['meta_query']=[['key'=>'_price','value'=>$max,'compare'=>'<=','type'=>'DECIMAL(12,2)']]; }
        $visibility=wc_get_product_visibility_term_ids();
        $args['tax_query']=[['taxonomy'=>'product_visibility','field'=>'term_taxonomy_id','terms'=>[$visibility['exclude-from-search']],'operator'=>'NOT IN']];
        $query=new WP_Query($args); $products=[];
        foreach ($query->posts as $post) { $p=mwd_public_product($post->ID); if ($p) { $products[]=mwd_product_data($p); } }
        return ['products'=>$products,'returned'=>count($products)];
    }
    if (in_array($action,['product','add'],true)) {
        $p=mwd_public_product((int)$request->get_param('product_id'));
        if (!$p) { return new WP_Error('invalid_product','找不到可公開瀏覽的商品。',['status'=>404]); }
        if ('product'===$action) { return mwd_product_data($p); }
    }
    if (null===WC()->cart) { wc_load_cart(); }
    try {
        if ('add'===$action) {
            if (!$p->is_type('simple') || !$p->is_purchasable() || !$p->is_in_stock()) { return new WP_Error('not_purchasable','此商品無法直接加入，請至商品頁選擇規格。',['status'=>400]); }
            // A dedicated line keeps existing cart items intact during demo cleanup.
            $key=WC()->cart->add_to_cart($p->get_id(),1,0,[],['merveille_demo_owner'=>get_current_user_id()]);
            if (!$key) { return new WP_Error('cart_failed','無法加入購物車，請檢查商品庫存。',['status'=>400]); }
        }
        if ('cleanup'===$action) {
            foreach (WC()->cart->get_cart() as $key=>$item) {
                if (isset($item['merveille_demo_owner']) && get_current_user_id()===$item['merveille_demo_owner']) { WC()->cart->remove_cart_item($key); }
            }
        }
        WC()->cart->calculate_totals();
        WC()->cart->set_session();
        return mwd_cart_data();
    } catch (Exception $e) { return new WP_Error('cart_error',wp_strip_all_tags($e->getMessage()),['status'=>400]); }
}
add_action('rest_api_init',function () {
    foreach (['search','product','add','cart','cleanup'] as $action) {
        $args=[];
        if ('search'===$action) {
            $args=['query'=>['type'=>'string','maxLength'=>80,'sanitize_callback'=>'sanitize_text_field'],
                'max_price'=>['type'=>'number','minimum'=>0,'maximum'=>1000000]];
        }
        if (in_array($action,['product','add'],true)) { $args=['product_id'=>['type'=>'integer','minimum'=>1,'required'=>true]]; }
        register_rest_route('merveille-demo/v1','/'.$action,[
            'methods'=>'POST','args'=>$args,
            'permission_callback'=>function ($r) { return current_user_can('manage_options') && wp_verify_nonce($r->get_header('X-WP-Nonce'),'wp_rest'); },
            'callback'=>function ($r) use ($action) { $r->set_param('action',$action); $result=mwd_execute($r); if (is_wp_error($result)) { return $result; } $response=rest_ensure_response($result); $response->header('Cache-Control','no-store'); return $response; },
        ]);
    }
});
