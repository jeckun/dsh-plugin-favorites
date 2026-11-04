# 收藏夹 · DSH 右侧栏插件

在 DeepSeek Harness 的右侧边栏中收藏网址、按分类整理，并把网站图标拖到其他分类完成归类。

## 作者信息

- 作者：Jeckun
- 日期：2026-11-5
- 协议：MIT（见 [LICENSE](LICENSE)）

## 功能

- 右侧栏新增「收藏夹」页签，从侧栏的开始页进入；快捷键 `Ctrl+Shift+P`（macOS 为 `Cmd+Shift+P`）。
- 顶部标题、收藏数量、添加菜单（添加链接 / 新建分类）。
- 分类可折叠、重命名、删除；删除分类时网址移到「未分类」。
- 拖动分类行可调整分类顺序，深灰色横线表示放置位置。
- 网址支持添加、编辑、删除，点击图标在新标签页打开。
- 网站图标可在分类之间拖放，也可在同一分类内拖动排序；灰色竖线表示放置位置。拖到折叠分类会自动展开。
- 数据保存在浏览器 `localStorage`（`dsh.favorites.v1`），刷新和重启后保留。
- 首次使用时自动加入 `DeepSeek Api` → `https://platform.deepseek.com/usage`，放在「未分类」中；不预置任何用户分类。

## 目录

```
dsh-plugin-favorites/
├── lib/index.js          Host 空实现（浏览器插件入口由 dsh.client 发现）
├── lib/client.js         右侧栏页签、界面、拖放和 localStorage 持久化
├── cordis.patch.yml      作为 bundle 安装时插入 favorites 行
├── locale/{zh,en}.json   插件列表中的标题和描述
├── icon.svg              插件图标
├── LICENSE               MIT 许可证正文
└── package.json
```

## 安装

本机已安装到：

- `C:\Users\jecku\.dsh\profiles\desktop\package.json` 的 `link:` 依赖
- `C:\Users\jecku\.dsh\profiles\desktop\cordis.patch.yml` 的 `favorites` 行

如果当前窗口还没有出现「收藏夹」，刷新一次页面（Ctrl+R）；仍没有则重启 DSH。

## 使用

1. 打开一个会话，展开右侧边栏。
2. 在开始页点击「收藏夹」。
3. 点击右上角「添加」→「添加链接」或「新建分类」。
4. 展开分类后，把网址图标拖到另一个分类即可移动；在同一分类内拖动可调整顺序，灰色竖线表示插入位置。
5. 按住分类行拖动可调整分类顺序，深灰色横线表示插入位置。
