(() => {
  'use strict';
  const root=document.getElementById('mwd-demo'); if(!root)return;
  const cfg=window.merveilleDemoConfig, $=id=>document.getElementById(id);
  let busy=false;
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  function button(label,fn){const b=node('button',label);b.type='button';b.onclick=()=>fn().catch(()=>{});return b;}
  function money(p){return `${p.currency} ${Number(p.price).toLocaleString()}`;}
  function products(data){const list=$('mwd-products');list.replaceChildren();$('mwd-detail').replaceChildren();if(!data.products.length){list.textContent='沒有符合條件的商品，請調整關鍵字或金額。';return;}for(const p of data.products){const card=node('article',undefined,'mwd-product');if(p.image){const img=node('img');img.src=p.image;img.alt=p.name;card.append(img);}card.append(node('h3',p.name),node('p',money(p)),button('查看商品',()=>run('product',{product_id:p.id},'手動測試')));list.append(card);}}
  function detail(p){const box=$('mwd-detail');box.replaceChildren(node('h3',p.name),node('p',p.description||'請至商品頁查看完整介紹。'),node('strong',money(p)));const link=node('a','商品頁 ↗');link.href=p.url;link.target='_blank';link.rel='noopener';box.append(link);if(p.can_add)box.append(button('加入購物車 1 件',()=>run('add',{product_id:p.id},'手動測試')));else box.append(node('p','此商品需選擇規格或目前無法購買。'));}
  function cart(data){const box=$('mwd-cart-result');box.replaceChildren(node('h3',`購物車 · ${data.count} 件`));for(const p of data.items)box.append(node('p',`${p.name} × ${p.quantity}${p.demo?' · Demo':''}`));box.append(node('strong',data.total),node('p',data.message));if(window.jQuery)window.jQuery(document.body).trigger('wc_fragment_refresh');}
  async function run(action,args={},source='WebMCP',signal){if(busy)throw Error('上一個工具仍在執行，請稍後再試。');busy=true;root.setAttribute('aria-busy','true');const row=node('li');row.append(node('small',source),node('code',names[action]),node('span','執行中…'));$('mwd-log').prepend(row);while($('mwd-log').children.length>6)$('mwd-log').lastChild.remove();try{const res=await fetch(cfg.api+action,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-WP-Nonce':cfg.nonce},body:JSON.stringify(args),signal});const data=await res.json();if(!res.ok)throw Error(data.message||`HTTP ${res.status}`);if(action==='search')products(data);else if(action==='product')detail(data);else cart(data);row.lastChild.textContent='✓ 完成';row.classList.add('mwd-success');return data;}catch(e){row.lastChild.textContent=`失敗：${e.message}`;row.classList.add('mwd-error');throw e;}finally{busy=false;root.removeAttribute('aria-busy');}}
  const names={search:'merveille_search_products',product:'merveille_get_product',add:'merveille_add_to_cart',cart:'merveille_get_cart',cleanup:'merveille_cleanup_demo_cart'};
  $('mwd-search').onsubmit=e=>{e.preventDefault();const args={query:$('mwd-query').value};if($('mwd-price').value!=='')args.max_price=Number($('mwd-price').value);run('search',args,'手動測試').catch(()=>{});};
  $('mwd-cart').onclick=()=>run('cart',{},'手動測試').catch(()=>{});
  $('mwd-clean').onclick=()=>run('cleanup',{},'手動測試').catch(()=>{});
  $('mwd-toggle').onclick=()=>{const hidden=$('mwd-body').hidden=!$('mwd-body').hidden;$('mwd-toggle').textContent=hidden?'展開 Demo':'收合';};
  $('mwd-copy').onclick=async()=>{try{await navigator.clipboard.writeText('請使用這個網頁的 Merveille WebMCP 工具，搜尋 500 元以下的耳環，查看一件有庫存且可直接購買的商品，再加入購物車 1 件，最後列出購物車內容。不要結帳。');$('mwd-copy').textContent='已複製 AI 指令';}catch{$('mwd-copy').textContent='請手動複製：搜尋 500 元以下耳環並加入 1 件，不結帳。';}};
  const schema=(properties={},required=[])=>({type:'object',properties,required,additionalProperties:false});
  const idSchema=schema({product_id:{type:'integer',minimum:1,description:'從商品搜尋結果取得的商品 ID'}},['product_id']);
  const definitions=[
    ['search','搜尋 Merveille 真實公開商品，並在 Demo 面板呈現結果。',schema({query:{type:'string',maxLength:80},max_price:{type:'number',minimum:0,maximum:1000000}}),true],
    ['product','查看商品詳情並在面板展示。can_add 表示能否直接加入購物車。',idSchema,true],
    ['add','將指定商品加入目前登入者的真實購物車 1 件並更新畫面。不建立訂單、不付款。',idSchema,false],
    ['cart','顯示目前登入者的購物車品項與總額。',schema(),true],
    ['cleanup','只移除目前使用者透過本 Demo 加入的商品，保留其他購物車品項。',schema(),false]
  ];
  async function register(){const api=document.modelContext||navigator.modelContext;if(!api?.registerTool){$('mwd-native').textContent='WebMCP 尚未可用 · 下方按鈕可測試真實網站功能（不代表 AI 已連線）。';return;}const controller=new AbortController();try{for(const [action,description,inputSchema,readOnlyHint]of definitions){await api.registerTool({name:names[action],description,inputSchema,annotations:{readOnlyHint,untrustedContentHint:true},execute:async(args,context={})=>JSON.stringify(await run(action,args,'WebMCP',context.signal))},{signal:controller.signal});}$('mwd-native').textContent='WebMCP 已就緒 · 5 個工具已註冊，等待 AI 呼叫。';addEventListener('pagehide',()=>controller.abort(),{once:true});}catch(e){controller.abort();$('mwd-native').textContent=`WebMCP 註冊失敗：${e.message}。可使用按鈕測試。`;}}
  register();
})();
