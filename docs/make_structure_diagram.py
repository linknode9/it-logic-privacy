#!/usr/bin/env python3
"""実務語マップ 構造図 generator (matplotlib)."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
from matplotlib.font_manager import FontProperties

JP = FontProperties(fname="/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf")

def font(size, bold=False):
    fp = FontProperties(fname="/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf")
    fp.set_size(size)
    if bold:
        fp.set_weight("bold")
    return fp

fig, ax = plt.subplots(figsize=(16, 10))
ax.set_xlim(0, 16)
ax.set_ylim(0, 10)
ax.axis("off")
fig.patch.set_facecolor("#ffffff")

# ---- Title ----
ax.text(8, 9.55, "実務語マップ 構造図 ―― vibe coding の流れで掴む",
        ha="center", va="center", fontproperties=font(22, True), color="#1a1a2e")
ax.text(8, 9.05, "「書く → 動かす → つなぐ → 公開する → 直す」 の一本道。秘密情報と道具は全工程を貫く。",
        ha="center", va="center", fontproperties=font(12), color="#555")

# ---- Pipeline stages ----
stages = [
    ("① 書く",       "#4361ee", 1.3,  ["9 エディタ/CLI", "1 Git/GitHub", "5 部品・依存関係"]),
    ("② 動かす",     "#3a86ff", 4.0,  ["6 Web基礎", "2 ローカル/ビルド"]),
    ("③ つなぐ",     "#2ec4b6", 6.7,  ["3 API・通信", "7 データベース", "8 AI / LLM"]),
    ("④ 公開する",   "#ff9f1c", 9.4,  ["2 デプロイ/本番", "10 クラウド"]),
    ("⑤ 直す",       "#e63946", 12.1, ["11 デバッグ"]),
]
box_w = 2.5
y_head = 7.6
y_box_top = 6.7

for name, color, x, items in stages:
    # stage header pill
    ax.add_patch(FancyBboxPatch((x, y_head), box_w, 0.6,
                 boxstyle="round,pad=0.02,rounding_size=0.15",
                 fc=color, ec="none", zorder=3))
    ax.text(x + box_w/2, y_head + 0.3, name, ha="center", va="center",
            fontproperties=font(15, True), color="white", zorder=4)
    # category boxes
    yy = y_box_top
    for it in items:
        h = 0.55
        ax.add_patch(FancyBboxPatch((x, yy - h), box_w, h,
                     boxstyle="round,pad=0.02,rounding_size=0.08",
                     fc="white", ec=color, lw=2, zorder=3))
        ax.text(x + box_w/2, yy - h/2, it, ha="center", va="center",
                fontproperties=font(11), color="#222", zorder=4)
        yy -= h + 0.18

# arrows between stages
arrow_y = 7.9
for i in range(len(stages) - 1):
    x0 = stages[i][2] + box_w
    x1 = stages[i+1][2]
    ax.add_patch(FancyArrowPatch((x0 + 0.02, arrow_y), (x1 - 0.02, arrow_y),
                 arrowstyle="-|>", mutation_scale=22, color="#888", lw=2.5, zorder=2))

# ---- Cross-cutting band: 設定・秘密・認証 (4) ----
band_y = 3.7
ax.add_patch(FancyBboxPatch((1.3, band_y), 13.3, 0.85,
             boxstyle="round,pad=0.02,rounding_size=0.12",
             fc="#fff3cd", ec="#e0a800", lw=2, zorder=2, hatch=None))
ax.text(8.0, band_y + 0.43,
        "横串 ①  4 設定・秘密情報・認証   ＝  環境変数 / APIキー / トークン / 認証  （全工程を貫く）",
        ha="center", va="center", fontproperties=font(13, True), color="#8a6d00", zorder=4)

# dashed connectors from band to each stage
for name, color, x, items in stages:
    ax.plot([x + box_w/2, x + box_w/2], [band_y + 0.85, y_box_top - 1.9 if items else band_y + 0.85],
            ls=":", color="#e0a800", lw=1.2, zorder=1)

# ---- Cross-cutting band: 現代スタック固有名 (12) ----
band2_y = 2.6
ax.add_patch(FancyBboxPatch((1.3, band2_y), 13.3, 0.8,
             boxstyle="round,pad=0.02,rounding_size=0.12",
             fc="#e7f5ff", ec="#3a86ff", lw=2, zorder=2))
ax.text(8.0, band2_y + 0.4,
        "横串 ②  12 現代スタックの固有名   ＝  VS Code / Cursor・Claude Code / React・Next.js / Vercel / Supabase  （各工程で使う実物の道具）",
        ha="center", va="center", fontproperties=font(11.5, True), color="#1864ab", zorder=4)

# ---- Legend / priority ----
ax.text(1.3, 1.7, "優先度（収録の順番）：", fontproperties=font(12, True), color="#222")
legend = [("🔴 必須", "#e63946", "知らないと話にならない"),
          ("🟡 重要", "#ff9f1c", "知っておくべき"),
          ("🟢 発展", "#2ec4b6", "知っておいた方がいい")]
lx = 4.4
for mark, col, desc in legend:
    ax.add_patch(plt.Circle((lx, 1.78), 0.09, color=col, zorder=3))
    ax.text(lx + 0.22, 1.78, f"{mark.split()[1]}：{desc}", va="center",
            fontproperties=font(11), color="#222")
    lx += 3.7

# ---- footnote on flow of one cross-cut term ----
ax.text(1.3, 0.95,
        "読み解き例：「トークン」は ③つなぐ(API利用) で必要 → ④公開 で本番用に切替 → 横串①(秘密管理) で .env に隔離。",
        fontproperties=font(10.5), color="#666")
ax.text(1.3, 0.55,
        "1語が工程をまたいで姿を変える ＝ 丸暗記でなく「構造」で掴む、が IT Logic の見せ場。",
        fontproperties=font(10.5), color="#666")

plt.tight_layout()
out = "/home/user/it-logic-privacy/docs/structure-diagram.png"
plt.savefig(out, dpi=130, bbox_inches="tight", facecolor="#ffffff")
print("saved", out)
