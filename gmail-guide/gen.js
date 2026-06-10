const sharp = require('sharp');
const fs = require('fs');

const W = 1000, H = 680;
const FONT = "IPAGothic, 'IPA Gothic', sans-serif";

// ---------- helpers ----------
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function frame(title, bodySvg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="${FONT}">
  <rect width="${W}" height="${H}" fill="#f6f8fc"/>
  <!-- Gmail top bar -->
  <rect x="0" y="0" width="${W}" height="56" fill="#ffffff"/>
  <line x1="0" y1="56" x2="${W}" y2="56" stroke="#e3e6ea" stroke-width="1"/>
  <circle cx="34" cy="28" r="3" fill="#5f6368"/><circle cx="34" cy="20" r="3" fill="#5f6368"/><circle cx="34" cy="36" r="3" fill="#5f6368"/>
  <circle cx="26" cy="28" r="3" fill="#5f6368"/><circle cx="42" cy="28" r="3" fill="#5f6368"/>
  <circle cx="26" cy="20" r="3" fill="#5f6368"/><circle cx="42" cy="20" r="3" fill="#5f6368"/>
  <circle cx="26" cy="36" r="3" fill="#5f6368"/><circle cx="42" cy="36" r="3" fill="#5f6368"/>
  <text x="64" y="36" font-size="22" fill="#d93025" font-weight="bold">M</text>
  <text x="86" y="35" font-size="20" fill="#5f6368">Gmail</text>
  <rect x="220" y="14" width="430" height="28" rx="14" fill="#eaf1fb"/>
  <text x="240" y="33" font-size="14" fill="#5f6368">メールを検索</text>
  <text x="${W-60}" y="35" font-size="13" fill="#fff" text-anchor="middle"></text>
  <circle cx="${W-34}" cy="28" r="15" fill="#1a73e8"/>
  <text x="${W-34}" y="33" font-size="14" fill="#fff" text-anchor="middle" font-weight="bold">T</text>
  <!-- title banner -->
  <rect x="0" y="56" width="${W}" height="40" fill="#1a73e8"/>
  <text x="24" y="82" font-size="18" fill="#ffffff" font-weight="bold">${esc(title)}</text>
  ${bodySvg}
</svg>`;
}

// rounded callout bubble with arrow pointing left
function callout(x, y, w, lines, color='#d93025') {
  const lh = 22, pad = 12;
  const h = lines.length*lh + pad*2;
  let t = '';
  lines.forEach((ln,i)=>{ t += `<text x="${x+pad}" y="${y+pad+18+i*lh}" font-size="15" fill="#ffffff" font-weight="bold">${esc(ln)}</text>`; });
  return `<polygon points="${x-12},${y+24} ${x},${y+14} ${x},${y+38}" fill="${color}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${color}"/>${t}`;
}

function numBadge(cx, cy, n, color='#d93025') {
  return `<circle cx="${cx}" cy="${cy}" r="16" fill="${color}"/><text x="${cx}" y="${cy+6}" font-size="18" fill="#fff" text-anchor="middle" font-weight="bold">${n}</text>`;
}

function btn(x,y,w,label,fill='#1a73e8',tc='#fff'){
  return `<rect x="${x}" y="${y}" width="${w}" height="36" rx="6" fill="${fill}"/><text x="${x+w/2}" y="${y+23}" font-size="14" fill="${tc}" text-anchor="middle" font-weight="bold">${esc(label)}</text>`;
}

const steps = [];

// ===== STEP 1 : open settings =====
steps.push({ name:'step1', title:'ステップ1 / 5 ： 設定を開く', body: `
  <rect x="${W-360}" y="110" width="320" height="300" rx="10" fill="#ffffff" stroke="#dadce0"/>
  <text x="${W-340}" y="142" font-size="16" fill="#202124" font-weight="bold">クイック設定</text>
  <line x1="${W-360}" y1="156" x2="${W-40}" y2="156" stroke="#e3e6ea"/>
  ${btn(W-340, 172, 280, 'すべての設定を表示', '#e8f0fe', '#1a73e8')}
  <text x="${W-340}" y="250" font-size="13" fill="#5f6368">表示間隔・テーマ など…</text>
  <!-- gear icon highlight -->
  <circle cx="${W-100}" cy="76" r="20" fill="none" stroke="#d93025" stroke-width="3"/>
  <text x="${W-100}" y="83" font-size="20" fill="#fff" text-anchor="middle">⚙</text>
  ${numBadge(W-380, 76, '1')}
  ${callout(W-330, 60, 230, ['① 右上の歯車 ⚙ を押す'])}
  ${numBadge(W-360, 190, '2')}
  ${callout(120, 200, 360, ['②「すべての設定を表示」を','　 クリック'])}
  <line x1="480" y1="222" x2="${W-345}" y2="190" stroke="#d93025" stroke-width="2" stroke-dasharray="5 4"/>
`});

// ===== STEP 2 : filters tab, create new =====
steps.push({ name:'step2', title:'ステップ2 / 5 ： フィルタ作成を開始', body: `
  <!-- settings tabs -->
  <rect x="0" y="96" width="${W}" height="38" fill="#ffffff"/>
  <line x1="0" y1="134" x2="${W}" y2="134" stroke="#e3e6ea"/>
  <text x="24" y="120" font-size="13" fill="#5f6368">全般</text>
  <text x="90" y="120" font-size="13" fill="#5f6368">ラベル</text>
  <text x="160" y="120" font-size="13" fill="#5f6368">受信トレイ</text>
  <text x="270" y="120" font-size="13" fill="#1a73e8" font-weight="bold">フィルタとブロック中のアドレス</text>
  <line x1="262" y1="132" x2="510" y2="132" stroke="#1a73e8" stroke-width="3"/>
  ${numBadge(244, 113, '3')}
  ${callout(530, 100, 360, ['③ このタブを開く'])}
  <rect x="40" y="180" width="${W-80}" height="120" rx="8" fill="#ffffff" stroke="#dadce0"/>
  <text x="60" y="220" font-size="14" fill="#5f6368">フィルタが設定されていません。</text>
  ${btn(60, 248, 200, '新しいフィルタを作成', '#1a73e8')}
  ${numBadge(40, 266, '4')}
  ${callout(290, 232, 360, ['④「新しいフィルタを作成」を押す'])}
`});

// ===== STEP 3 : condition To =====
steps.push({ name:'step3', title:'ステップ3 / 5 ： 条件を入力（To）', body: `
  <rect x="180" y="130" width="${W-360}" height="380" rx="10" fill="#ffffff" stroke="#dadce0"/>
  <!-- From -->
  <text x="210" y="180" font-size="14" fill="#5f6368">From</text>
  <rect x="300" y="164" width="380" height="34" rx="4" fill="#fff" stroke="#dadce0"/>
  <!-- To -->
  <text x="210" y="230" font-size="14" fill="#202124" font-weight="bold">To</text>
  <rect x="300" y="214" width="380" height="36" rx="4" fill="#fff" stroke="#d93025" stroke-width="2"/>
  <text x="312" y="238" font-size="15" fill="#202124" font-weight="bold">support@linknode.dev</text>
  <!-- Subject -->
  <text x="210" y="282" font-size="14" fill="#5f6368">件名</text>
  <rect x="300" y="266" width="380" height="34" rx="4" fill="#fff" stroke="#dadce0"/>
  <text x="210" y="334" font-size="14" fill="#5f6368">含む</text>
  <rect x="300" y="318" width="380" height="34" rx="4" fill="#fff" stroke="#dadce0"/>
  ${numBadge(285, 232, '5')}
  ${callout(700, 200, 270, ['⑤ To 欄にだけ', '   support@linknode.dev'])}
  ${btn(540, 430, 140, 'フィルタを作成', '#1a73e8')}
  ${numBadge(520, 448, '6')}
  ${callout(330, 432, 175, ['⑥ 右下のボタン'], '#188038')}
  <line x1="505" y1="448" x2="540" y2="448" stroke="#188038" stroke-width="2" stroke-dasharray="5 4"/>
`});

// ===== STEP 4 : actions =====
steps.push({ name:'step4', title:'ステップ4 / 5 ： 動作を選ぶ', body: `
  <rect x="120" y="120" width="${W-240}" height="420" rx="10" fill="#ffffff" stroke="#dadce0"/>
  <text x="150" y="158" font-size="14" fill="#5f6368">この条件に一致するメールが届いたとき：</text>
  ${chk(150,180,true,'受信トレイをスキップ（アーカイブする）')}
  ${chk(150,222,false,'既読にする')}
  ${chk(150,264,true,'ラベルを付ける：',true)}
  <rect x="430" y="252" width="240" height="32" rx="4" fill="#fff" stroke="#1a73e8" stroke-width="2"/>
  <text x="444" y="273" font-size="14" fill="#202124" font-weight="bold">Linknode Support</text>
  ${chk(150,330,true,'一致するスレッドにもフィルタを適用する')}
  ${callout(700, 250, 270, ['⑦「ラベルを付ける」→', '   新規作成で', '   Linknode Support'])}
  ${numBadge(150, 270, '7')}
  ${callout(700, 168, 270, ['（任意）受信トレイから', '   外したい場合はON'], '#188038')}
  ${numBadge(150, 188, '7', '#188038')}
  ${btn(540, 470, 140, 'フィルタを作成', '#1a73e8')}
  ${numBadge(520, 488, '8')}
  ${callout(280, 472, 230, ['⑧「フィルタを作成」で確定'])}
`});

// ===== STEP 5 : result =====
steps.push({ name:'step5', title:'ステップ5 / 5 ： 完成イメージ', body: `
  <!-- left nav with label -->
  <rect x="0" y="96" width="220" height="${H-96}" fill="#ffffff"/>
  <line x1="220" y1="96" x2="220" y2="${H}" stroke="#e3e6ea"/>
  ${btn(16,116,120,'作成','#c2e7ff','#001d35')}
  <text x="24" y="178" font-size="14" fill="#202124">受信トレイ</text>
  <text x="24" y="216" font-size="14" fill="#5f6368">スター付き</text>
  <text x="24" y="254" font-size="14" fill="#5f6368">送信済み</text>
  <text x="24" y="300" font-size="13" fill="#5f6368">ラベル</text>
  <rect x="12" y="316" width="196" height="30" rx="6" fill="#fce8e6"/>
  <circle cx="30" cy="331" r="6" fill="#d93025"/>
  <text x="46" y="336" font-size="14" fill="#202124" font-weight="bold">Linknode Support</text>
  <text x="190" y="336" font-size="13" fill="#5f6368">1</text>
  ${callout(250, 318, 330, ['ここに新しいフォルダ（ラベル）が', '出現！'])}
  <line x1="208" y1="331" x2="250" y2="331" stroke="#d93025" stroke-width="2" stroke-dasharray="5 4"/>
  <!-- mail row -->
  <rect x="236" y="120" width="${W-260}" height="56" rx="6" fill="#f2f6fc"/>
  <text x="256" y="145" font-size="14" fill="#202124" font-weight="bold">テスト送信者</text>
  <rect x="256" y="152" width="120" height="18" rx="9" fill="#fce8e6"/>
  <text x="266" y="165" font-size="11" fill="#d93025">Linknode Support</text>
  <text x="400" y="165" font-size="13" fill="#5f6368">To: support@linknode.dev で届いたメール</text>
  <text x="256" y="230" font-size="15" fill="#188038" font-weight="bold">✓ iPhone標準メール / Gmailアプリ 両方で</text>
  <text x="256" y="258" font-size="15" fill="#188038" font-weight="bold">　 「Linknode Support」フォルダとして見えます</text>
`});

function chk(x,y,checked,label,bold){
  const box = checked
    ? `<rect x="${x}" y="${y}" width="20" height="20" rx="3" fill="#1a73e8"/><path d="M${x+4} ${y+10} l4 4 l8 -9" stroke="#fff" stroke-width="2.5" fill="none"/>`
    : `<rect x="${x}" y="${y}" width="20" height="20" rx="3" fill="#fff" stroke="#9aa0a6" stroke-width="2"/>`;
  return `${box}<text x="${x+30}" y="${y+16}" font-size="15" fill="#202124" font-weight="${bold?'bold':'normal'}">${esc(label)}</text>`;
}

(async () => {
  for (const s of steps) {
    const svg = frame(s.title, s.body);
    const out = `/home/user/it-logic-privacy/gmail-guide/${s.name}.png`;
    await sharp(Buffer.from(svg)).png().toFile(out);
    console.log('wrote', out);
  }
})();
