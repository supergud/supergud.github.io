# 專案設定：個人品牌網站

> 這份設定是「護欄＋內容」。網站的視覺美學交給 frontend-design 發揮，這裡負責把它框在正確的內容、風格方向與技術限制內。

## 溝通方式

- 一律使用繁體中文回覆，並用白話文解釋你做了什麼。
- 每次修改前先說明打算怎麼改，等我確認再執行。
- 一次只改一個區塊，不要整站重寫。

## 網站名稱與定位

- 網站名稱：**Bruce Lee**（頁面同時帶出中文名 李冠緯）
- 一句話定位：幫想上線卻卡住的人，把網站真的做完、真的上線——包含自己 vibe coding 到一半做不下去的人。
- 他自己的定位寫法：**網站開發 × WordPress 社群 × AI 自動化**

## 可用素材與真實資料（已查證，直接拿來用，不要重問也不要另編一套）

來源是他本人簡報裡的個人介紹頁（`./slides/webmcp.html`、`./slides/google-stitch-to-wordpress.html`），兩份內容一致。LinkedIn 擋程式讀取，只當連結用。詳細版在 `website-brief.md` 第 0 節。

- 姓名／職稱：**Bruce Lee 李冠緯**／**哈拉設計 創辦人**
- 經歷：13+ 年網站開發與自由接案經驗；企業網站、活動網站、會員系統、主題開發與維運。
- 技能：WordPress、Laravel、前後端開發、伺服器維運、AI Workflow。
- 社群：WordPress Taipei Meetup、WordCamp Taiwan／Asia、WP Campus Connect 參與者與活動組織者。
- 可引用自述（原話，可直接用）：
  - 「把新技術拆成可落地的網站流程，是我平常最常做的事。」
  - 「我喜歡把新工具玩到真的可以上線。平常在寫程式、辦小聚，還有研究怎麼讓 AI 幫我少加一點班。」
- 聯絡方式：Email `brucelee@eat2die.com`（頁面上用 JS 分段組裝，避免被爬蟲直接掃走）／LinkedIn `https://www.linkedin.com/in/bruce-lee-supergud/`／GitHub `https://github.com/supergud`（handle @supergud）
- 圖片：`./avatar.jpg`（人像 1:1，用於「關於我」，複製自 `./slides/assets/bruce-lee-speaker.jpg`）
- **不可編造**：客戶名單、專案數量、營收、滿意度、年份以外的任何數字。找不到就標（待補）或不放。

## 目標受眾

- 對象：潛在客戶——正在評估「這個人能不能接我的案」的人。
- 我能幫他們解決的問題：
  1. **接手「自己 vibe coding 但卡住做不下去」的案子**（最有辨識度，放最前面）
  2. 設計稿 → 真的能維護、能上線的網站
  3. WordPress 開發與維運
  4. AI 自動化工作流
  5. 把技術講成人話（教學、內訓、演講）
- 文案要優先回答：「你能不能把我的東西做完並上線？」「跟你合作會不會很難溝通？」

## 網站目標與行動

- 主要目標：建立信任，讓潛在客戶主動來談合作。
- 次要目標：展示講題與作品找合作夥伴、當線上據點。
- **不做求職用途**，不要寫求職導向文案。
- 主要 CTA：寄信洽談（`mailto:`，由 `script.js` 組裝）。

## 頁面結構（一頁式，信任導向，依序）

1. **hero** — 主標一行講清楚「幫你把卡住的網站，真的做完、真的上線」＋ CTA ＋ 三個 stat
2. **關於我** — 照片＋簡報裡的真實自介與引言
3. **服務項目** — 五張卡片，對應上面五個問題
4. **信任證明** — 社群參與／公開講題（連到 `./slides/*.html`）／經歷。**原設計是「客戶評價」，但沒有真實推薦，所以改成全部可查證的事實。** `index.html` 該區有 HTML 註解標記客戶評價要放的位置。
5. **常見問題** — 6 題，依他陳述的服務範圍撰寫，內容待他本人校對
6. **聯絡方式** — mailto CTA ＋ LinkedIn／GitHub／簡報

- 六個區塊都要有實質內容，不要只放標題。

## 文案規範

- 不要誇大詞、業配感、空泛形容詞（「頂尖」「全方位」「一站式解決方案」）。
- **不要出現任何未經確認的數字**（客戶數、專案數、滿意度）。「13+ 年」是已查證的，可用。
- 主標一行內講出「我幫誰解決什麼」。
- 語氣白話、直接、不掉書袋——要對得起「把技術講成人話」這項服務。

## 視覺風格

- 關鍵字：科技現代、俐落、有 power。使用者明確要求「帥氣的互動效果，類似**火力展示**」——動效要明顯、有存在感。
- 排版：深色系、精準網格、俐落線條、卡片式。
- 字體：Noto Sans TC ＋ JetBrains Mono（數字／標籤點綴）。
- 色彩：深底 `#06080f` ＋ 薄荷綠 `#7ee4c3`／藍 `#5aa8ff`／紫 `#b98cff` 漸層與發光。
- 圖像：純 CSS／Canvas 幾何（動態網格、極光、游標光暈）。照片只有一張，視覺主要靠這些撐。
- 已實作的互動：Canvas 網格＋交點跟滑鼠亮起、極光漂移、游標追蹤光暈、scroll 逐項進場、數字跑動、卡片內光暈跟滑鼠、CTA 磁吸、hover 發光位移、FAQ 展開。
- **全部效果都要尊重 `prefers-reduced-motion`，也不得讓手機卡頓。**

## 技術限制（硬性護欄）

- **純靜態多檔案**：`index.html` + `style.css` + `script.js`，圖片放專案根目錄。
- **絕對不要用 React／Vue／Next.js，不要 npm install、不要 build、不要打包工具。** 動效一律原生 CSS／JS（IntersectionObserver、requestAnimationFrame、Canvas）。
- **CSS、JS、圖片一律相對路徑 `./`。**
- 單一頁面 + 錨點導覽。手機版需正常顯示。
- **`./slides/` 底下的既有簡報不要動、不要刪、不要改**，已經上線在用。
- `./avatar.jpg` 是 `./slides/assets/bruce-lee-speaker.jpg` 的副本，兩邊都要保留。

## 部署到 GitHub Pages

repo **已存在且已是使用者主站**：`https://github.com/supergud/supergud.github.io`，遠端 `origin` 已設定。**不要 `git init`，不要 `gh repo create`。**

- 網址：`https://supergud.github.io/`（沒有子目錄）
- 改完網站檔案後執行 `git add -A && git commit -m "更新網站" && git push`。
- Pages 約 30–60 秒後更新，請使用者重整瀏覽器。
- **預覽一定要開線上網址，絕對不要開本機 `file://` 的 `index.html`**——那只會是沒樣式的快照，會誤導。

## 不要起本機伺服器

- 不要 `python -m http.server`、`php -S`、`npx serve`，也不要做暫時合併版或臨時檔。
- 唯一預覽方式：部署後開 GitHub Pages 網址。

## 速度優先

- 一次把網站生成完就部署，**不要做截圖打磨迴圈**（禁止逐段截圖、重載等動畫再截圖、反覆微調）。
- 上線後要不要再美化，等使用者看完提出，再針對他說的地方改。

## 完工前品質檢查

- [ ] `index.html`／`style.css`／`script.js`／`avatar.jpg` 都在，沒有框架、沒有 node_modules、沒有 build 產物。
- [ ] 全部相對路徑 `./`。
- [ ] hero 主標一行講清楚「我幫誰解決什麼」。
- [ ] 內容用 `website-brief.md` 的真實文字，沒有 lorem ipsum、沒有假客戶、沒有假數字。
- [ ] 信任證明區沒有編造的推薦。
- [ ] 手機版不爆版，圖片有 alt，動效尊重 `prefers-reduced-motion`。
- [ ] `./slides/` 沒有被更動。
