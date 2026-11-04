# Favorites · DSH Right Sidebar Plugin

[中文说明](docs/README.zh-CN.md)

Save URLs in the DeepSeek Harness right sidebar, organize them by category, and drag links between categories to organize them.

## Author

- Author: Jeckun
- Date: 2026-11-05
- License: MIT (see [LICENSE](LICENSE))

## Features

- Adds a "Favorites" tab to the right sidebar's start page; shortcut: `Ctrl+Shift+P` (`Cmd+Shift+P` on macOS).
- Shows a title, favorite count, and an add menu (add link / create category).
- Categories can be collapsed, renamed, and deleted; deleting a category moves its links to "Uncategorized".
- Drag category rows to reorder them; a dark gray horizontal line indicates the drop position.
- Add, edit, and delete links; click an icon to open its URL in a new tab.
- Drag link icons between categories or within a category to reorder them; a gray vertical line indicates the insertion point. Collapsed categories expand automatically when a link is dragged onto them.
- Data is stored in browser `localStorage` (`dsh.favorites.v1`) and persists across refreshes and restarts.
- On first use, adds `DeepSeek Api` → `https://platform.deepseek.com/usage` to "Uncategorized"; no user categories are pre-created.

## Project structure

```
dsh-plugin-favorites/
├── lib/index.js          Host stub (the browser plugin entry is discovered through dsh.client)
├── lib/client.js         Sidebar tab, UI, drag-and-drop, and localStorage persistence
├── cordis.patch.yml      Inserts the favorites row when installed as a bundle
├── locale/{zh,en}.json   Plugin title and description in the plugin list
├── icon.svg              Plugin icon
├── LICENSE               MIT license
├── README.md             English documentation
└── docs/README.zh-CN.md  Chinese documentation
```

## Installation

Installed locally in:

- The `link:` dependency in `C:\Users\jecku\.dsh\profiles\desktop\package.json`
- The `favorites` row in `C:\Users\jecku\.dsh\profiles\desktop\cordis.patch.yml`

If "Favorites" does not appear in the current window, refresh the page (`Ctrl+R`). If it still does not appear, restart DSH.

## Usage

1. Open a conversation and expand the right sidebar.
2. Click "Favorites" on the start page.
3. Click "Add" in the upper-right corner, then choose "Add link" or "Create category".
4. Expand a category and drag a link icon to another category to move it. Drag within the same category to reorder links; a gray vertical line indicates the insertion point.
5. Drag a category row to reorder categories; a dark gray horizontal line indicates the drop position.
