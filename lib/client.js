window.__ModuleLoader__.load({
  id: '@local/dsh-plugin-favorites',
  factory(require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    const React = require('react');
    const h = React.createElement;
    const { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } = React;

    const PLUGIN_ID = '@local/dsh-plugin-favorites';
    const TAB_KIND = 'favorites';
    const LOCALE_NS = 'favorites';
    const STORAGE_KEY = 'dsh.favorites.v1';
    const DRAG_TYPE = 'application/x-dsh-favorite-link';
    const CATEGORY_DRAG_TYPE = 'application/x-dsh-favorite-category';
    const UNCATEGORIZED = '__uncategorized__';
    const ACCENT = '#4d6bfe';

    const zh = {
      'tab.title': '收藏夹',
      'tab.description': '收藏常用网址，按分类整理',
      'shortcut.open': '打开收藏夹',
      'shortcut.noSession': '请先选择会话',
      'title': '收藏夹',
      'summary': '{links} 个网址 · {categories} 个分类',
      'add': '添加',
      'addLink': '添加链接',
      'addCategory': '新建分类',
      'uncategorized': '未分类',
      'emptyTitle': '还没有收藏',
      'emptyBody': '把常用网址收进来，再用分类整理。',
      'emptyCategory': '暂无收藏',
      'dropHere': '松开，移动到这里',
      'dragHint': '拖动图标排序或换分类 · 拖动分类行调整顺序',
      'category.rename': '重命名分类',
      'category.delete': '删除分类',
      'link.edit': '编辑网址',
      'link.delete': '删除网址',
      'dialog.addLink': '添加链接',
      'dialog.editLink': '编辑链接',
      'dialog.addCategory': '新建分类',
      'dialog.renameCategory': '重命名分类',
      'field.name': '名称',
      'field.url': '网址',
      'field.category': '分类',
      'placeholder.name': '例如：DeepSeek 开放平台',
      'placeholder.url': 'https://example.com',
      'placeholder.category': '例如：工作',
      'action.cancel': '取消',
      'action.save': '保存',
      'action.add': '添加',
      'action.delete': '删除',
      'error.url': '请输入有效的 http/https 网址',
      'error.category': '请输入分类名称',
      'error.duplicate': '已经有同名分类了',
      'confirm.deleteLinkTitle': '删除这个网址？',
      'confirm.deleteLinkBody': '「{name}」将从收藏夹中移除。',
      'confirm.deleteCategoryTitle': '删除分类「{name}」？',
      'confirm.deleteCategoryBody': '分类中的 {count} 个网址会移到未分类，网址本身不会被删除。',
      'confirm.delete': '确认删除',
      'close': '关闭',
    };

    const en = {
      'tab.title': 'Favorites',
      'tab.description': 'Save and organize the sites you use',
      'shortcut.open': 'Open Favorites',
      'shortcut.noSession': 'Select a session first',
      'title': 'Favorites',
      'summary': '{links} sites · {categories} categories',
      'add': 'Add',
      'addLink': 'Add link',
      'addCategory': 'New category',
      'uncategorized': 'Uncategorized',
      'emptyTitle': 'No favorites yet',
      'emptyBody': 'Save the sites you use, then organize them into categories.',
      'emptyCategory': 'No saved sites',
      'dropHere': 'Release to move here',
      'dragHint': 'Drag icons to reorder or regroup · drag category rows to reorder',
      'category.rename': 'Rename category',
      'category.delete': 'Delete category',
      'link.edit': 'Edit link',
      'link.delete': 'Delete link',
      'dialog.addLink': 'Add link',
      'dialog.editLink': 'Edit link',
      'dialog.addCategory': 'New category',
      'dialog.renameCategory': 'Rename category',
      'field.name': 'Name',
      'field.url': 'URL',
      'field.category': 'Category',
      'placeholder.name': 'e.g. DeepSeek Platform',
      'placeholder.url': 'https://example.com',
      'placeholder.category': 'e.g. Work',
      'action.cancel': 'Cancel',
      'action.save': 'Save',
      'action.add': 'Add',
      'action.delete': 'Delete',
      'error.url': 'Enter a valid http/https URL',
      'error.category': 'Enter a category name',
      'error.duplicate': 'A category with that name already exists',
      'confirm.deleteLinkTitle': 'Delete this site?',
      'confirm.deleteLinkBody': '“{name}” will be removed from Favorites.',
      'confirm.deleteCategoryTitle': 'Delete “{name}”?',
      'confirm.deleteCategoryBody': 'Its {count} sites will move to Uncategorized; the sites themselves stay saved.',
      'confirm.delete': 'Delete',
      'close': 'Close',
    };

    const CSS = `
.dshfav-root{--dshfav-accent:${ACCENT};position:relative;display:flex;flex-direction:column;height:100%;min-height:0;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);font-size:13px;line-height:1.4}
.dshfav-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:16px 16px 10px}
.dshfav-heading{min-width:0}
.dshfav-title{margin:0;font-size:18px;font-weight:600;letter-spacing:-.02em;line-height:24px}
.dshfav-subtitle{margin:3px 0 0;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dshfav-addWrap{position:relative;flex:none}
.dshfav-add{display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 9px 0 8px;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;font-weight:600;white-space:nowrap;cursor:pointer;transition:background .15s,border-color .15s}
.dshfav-add:hover{background:var(--dsw-alias-interactive-bg-hover);border-color:var(--dsw-alias-border-l3)}
.dshfav-add:focus-visible{outline:2px solid var(--dshfav-accent);outline-offset:1px}
.dshfav-add svg{width:14px;height:14px}
.dshfav-add .dshfav-caret{width:11px;height:11px;color:var(--dsw-alias-label-tertiary)}
.dshfav-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:40;min-width:168px;padding:5px;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 10px 30px rgba(15,23,42,.16)}
.dshfav-menu button{display:flex;align-items:center;gap:9px;width:100%;height:34px;padding:0 9px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;text-align:left;cursor:pointer}
.dshfav-menu button:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshfav-menu svg{width:15px;height:15px;color:var(--dsw-alias-label-secondary);flex:none}
.dshfav-scroll{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:2px 10px 14px;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l3) transparent}
.dshfav-scroll::-webkit-scrollbar{width:8px}
.dshfav-scroll::-webkit-scrollbar-thumb{background:var(--dsw-alias-border-l2);border-radius:8px;border:2px solid transparent;background-clip:padding-box}
.dshfav-scroll::-webkit-scrollbar-track{background:transparent}
.dshfav-group{position:relative;margin-top:4px;border-radius:12px;transition:background .15s,box-shadow .15s}
.dshfav-group[data-drop=active]{background:rgba(77,107,254,.08);box-shadow:inset 0 0 0 1px rgba(77,107,254,.38)}
.dshfav-group[data-cat-drop=before]::before,.dshfav-group[data-cat-drop=after]::after{content:"";position:absolute;left:5px;right:5px;z-index:8;height:3px;border-radius:3px;background:#5f6673;pointer-events:none;box-shadow:0 0 0 1px rgba(255,255,255,.18)}
.dshfav-group[data-cat-drop=before]::before{top:-3px}
.dshfav-group[data-cat-drop=after]::after{bottom:-3px}
.dshfav-group[data-category-dragging=true]{opacity:.42}
.dshfav-groupHead{display:flex;align-items:center;min-height:36px;padding:1px 2px;border-radius:10px}
.dshfav-groupHead[draggable=true]{cursor:grab}
.dshfav-groupHead[draggable=true]:active{cursor:grabbing}
.dshfav-groupHead:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshfav-groupToggle{display:flex;align-items:center;gap:7px;flex:1;min-width:0;height:34px;padding:0 4px 0 6px;border:0;border-radius:8px;background:transparent;color:inherit;font:inherit;font-size:13px;text-align:left;cursor:pointer}
.dshfav-groupToggle:focus-visible{outline:2px solid var(--dshfav-accent);outline-offset:-2px}
.dshfav-chev{flex:none;width:14px;height:14px;color:var(--dsw-alias-label-tertiary);transition:transform .15s}
.dshfav-group[data-collapsed=true] .dshfav-chev{transform:rotate(-90deg)}
.dshfav-folder{display:inline-flex;flex:none;color:var(--dsw-alias-label-tertiary)}
.dshfav-folder svg{width:15px;height:15px}
.dshfav-groupName{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
.dshfav-count{flex:none;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:18px;text-align:center;font-variant-numeric:tabular-nums}
.dshfav-groupActions{display:flex;align-items:center;gap:1px;flex:none;padding-right:2px;opacity:.55;transition:opacity .15s}
.dshfav-groupHead:hover .dshfav-groupActions,.dshfav-groupActions:focus-within{opacity:1}
.dshfav-iconBtn{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;padding:0;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer}
.dshfav-iconBtn:hover{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}
.dshfav-iconBtn:focus-visible{outline:2px solid var(--dshfav-accent);outline-offset:-1px}
.dshfav-iconBtn svg{width:13px;height:13px}
.dshfav-grid{position:relative;display:grid;grid-template-columns:repeat(auto-fill,minmax(82px,1fr));gap:2px 4px;padding:4px 2px 8px}
.dshfav-linkDropLine{position:absolute;z-index:7;width:3px;border-radius:3px;background:#5f6673;pointer-events:none;transform:translateX(-50%);box-shadow:0 0 0 1px rgba(255,255,255,.18)}
body[data-ds-dark-theme] .dshfav-group[data-cat-drop=before]::before,body[data-ds-dark-theme] .dshfav-group[data-cat-drop=after]::after,body[data-ds-dark-theme] .dshfav-linkDropLine{background:#aeb6c2;box-shadow:none}
.dshfav-card{position:relative;min-width:0;border:1px solid transparent;border-radius:12px;transition:background .15s,border-color .15s,opacity .15s}
.dshfav-card:hover{background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l1)}
.dshfav-card[data-dragging=true]{opacity:.35}
.dshfav-cardLink{display:flex;flex-direction:column;align-items:center;gap:7px;padding:10px 5px 9px;border-radius:12px;color:inherit;text-decoration:none;outline:none}
.dshfav-cardLink:focus-visible{box-shadow:0 0 0 2px var(--dshfav-accent)}
.dshfav-icon{display:flex;align-items:center;justify-content:center;width:44px;height:44px;flex:none;overflow:hidden;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}
.dshfav-card:hover .dshfav-icon{background:var(--dsw-alias-bg-base)}
.dshfav-icon img{display:block;width:26px;height:26px;object-fit:contain}
.dshfav-initial{font-size:17px;font-weight:700;color:var(--dsw-alias-label-secondary)}
.dshfav-name{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;max-width:100%;overflow:hidden;color:var(--dsw-alias-label-primary);font-size:11px;line-height:15px;text-align:center;word-break:break-word}
.dshfav-cardActions{position:absolute;top:1px;right:1px;display:flex;gap:0;opacity:0;transition:opacity .15s}
.dshfav-card:hover .dshfav-cardActions,.dshfav-card:focus-within .dshfav-cardActions{opacity:1}
.dshfav-cardActions .dshfav-iconBtn{width:21px;height:21px;background:var(--dsw-alias-bg-base);box-shadow:0 1px 2px rgba(15,23,42,.14)}
.dshfav-emptyDrop{grid-column:1/-1;display:flex;align-items:center;justify-content:center;min-height:54px;padding:10px;border:1px dashed var(--dsw-alias-border-l3);border-radius:10px;color:var(--dsw-alias-label-tertiary);font-size:11px;text-align:center}
.dshfav-group[data-drop=active] .dshfav-emptyDrop{border-color:var(--dshfav-accent);color:var(--dshfav-accent)}
.dshfav-empty{display:flex;flex-direction:column;align-items:center;padding:54px 22px 24px;text-align:center}
.dshfav-emptyIcon{display:flex;align-items:center;justify-content:center;width:64px;height:64px;margin-bottom:15px;border:1px solid var(--dsw-alias-border-l1);border-radius:20px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-tertiary)}
.dshfav-emptyIcon svg{width:30px;height:30px}
.dshfav-emptyTitle{margin:0;font-size:14px;font-weight:600;line-height:20px}
.dshfav-emptyBody{max-width:230px;margin:5px 0 17px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:17px}
.dshfav-emptyActions{display:flex;align-items:center;gap:8px}
.dshfav-button{height:30px;padding:0 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;font-weight:600;cursor:pointer}
.dshfav-button:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dshfav-button[data-primary=true]{border-color:var(--dshfav-accent);background:var(--dshfav-accent);color:#fff}
.dshfav-button[data-primary=true]:hover{filter:brightness(1.05)}
.dshfav-button[data-danger=true]{border-color:transparent;background:#d94747;color:#fff}
.dshfav-button[data-danger=true]:hover{filter:brightness(1.05)}
.dshfav-hint{display:flex;align-items:center;gap:6px;flex:none;padding:8px 16px;border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px}
.dshfav-hint svg{width:12px;height:12px;flex:none}
.dshfav-overlay{position:absolute;inset:0;z-index:50;display:flex;align-items:flex-start;justify-content:center;padding:46px 12px 12px;background:rgba(10,14,28,.34);backdrop-filter:blur(2px)}
.dshfav-dialog{width:100%;max-width:340px;padding:17px;border:1px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 18px 50px rgba(10,14,28,.28)}
.dshfav-dialogHead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}
.dshfav-dialogTitle{margin:0;font-size:15px;font-weight:600;line-height:22px}
.dshfav-dialogClose{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;padding:0;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer}
.dshfav-dialogClose:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dshfav-dialogClose svg{width:14px;height:14px}
.dshfav-form{display:flex;flex-direction:column;gap:12px}
.dshfav-field{display:flex;flex-direction:column;gap:5px}
.dshfav-label{color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600}
.dshfav-input,.dshfav-select{width:100%;height:34px;box-sizing:border-box;padding:0 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;outline:none}
.dshfav-input::placeholder{color:var(--dsw-alias-label-tertiary)}
.dshfav-input:focus,.dshfav-select:focus{border-color:var(--dshfav-accent);box-shadow:0 0 0 2px rgba(77,107,254,.16)}
.dshfav-error{margin:0;padding:7px 9px;border-radius:8px;background:rgba(217,71,71,.1);color:#d94747;font-size:11px;line-height:15px}
.dshfav-dialogActions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
.dshfav-confirmText{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.dshfav-titleGlyph{width:15px;height:15px;margin-right:6px;vertical-align:-2px;color:var(--dsw-alias-label-secondary)}
@media (prefers-reduced-motion:reduce){.dshfav-group,.dshfav-card,.dshfav-chev,.dshfav-iconBtn,.dshfav-add,.dshfav-menu button{transition:none}}
`;

function makeId(prefix) {
  return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

function seedState() {
  return {
    version: 1,
    categories: [],
    uncategorizedCollapsed: false,
    links: [
      {
        id: makeId('link'),
        name: 'DeepSeek Api',
        url: 'https://platform.deepseek.com/usage',
        categoryId: null,
        createdAt: Date.now(),
        order: 0,
      },
    ],
  };
}

function cleanState(raw) {
  if (raw === null || typeof raw !== 'object' || raw.version !== 1) return null;
  if (!Array.isArray(raw.categories) || !Array.isArray(raw.links)) return null;
  const seenCategories = new Set();
  const categories = [];
  raw.categories.forEach((entry, index) => {
    if (entry === null || typeof entry !== 'object') return;
    const id = typeof entry.id === 'string' ? entry.id : '';
    const name = typeof entry.name === 'string' ? entry.name.trim() : '';
    if (id === '' || name === '' || seenCategories.has(id)) return;
    seenCategories.add(id);
    categories.push({
      id,
      name,
      collapsed: entry.collapsed === true,
      order: Number.isFinite(entry.order) ? entry.order : index,
    });
  });
  categories.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  const seenLinks = new Set();
  const links = [];
  raw.links.forEach((entry, index) => {
    if (entry === null || typeof entry !== 'object') return;
    const id = typeof entry.id === 'string' ? entry.id : '';
    const name = typeof entry.name === 'string' ? entry.name.trim() : '';
    const url = typeof entry.url === 'string' ? entry.url.trim() : '';
    if (id === '' || name === '' || url === '' || seenLinks.has(id)) return;
    seenLinks.add(id);
    links.push({
      id,
      name,
      url,
      categoryId: seenCategories.has(entry.categoryId) ? entry.categoryId : null,
      createdAt: Number.isFinite(entry.createdAt) ? entry.createdAt : Date.now() + index,
      order: Number.isFinite(entry.order) ? entry.order : undefined,
    });
  });

  // Link order is scoped to its category. Older documents have no order field;
  // their raw array order is already the visible newest-first order, so use it
  // as the migration source. Every load re-numbers each category to 0..n-1,
  // which also repairs gaps left by moving a card in or out.
  const byCategory = new Map();
  links.forEach((link) => {
    const key = link.categoryId === null ? UNCATEGORIZED : link.categoryId;
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(link);
  });
  for (const group of byCategory.values()) {
    const ordered = group.every((link) => Number.isFinite(link.order))
      ? group.slice().sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
      : group;
    ordered.forEach((link, order) => {
      link.order = order;
    });
  }

  return {
    version: 1,
    categories,
    uncategorizedCollapsed: raw.uncategorizedCollapsed === true,
    links,
  };
}

function readState() {
  let raw = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== null) {
    try {
      const parsed = cleanState(JSON.parse(raw));
      if (parsed !== null) return parsed;
    } catch {
      // A corrupt entry should not take the panel down; fall through to seed.
    }
  }
  const seeded = seedState();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch {
    // Storage may be unavailable; the in-memory state still works.
  }
  return seeded;
}

/**
 * One page-local snapshot shared by every mounted Favorites tab. The sidebar can
 * split or duplicate a tab; separate React states would overwrite each other on
 * the next write, so the module owns the snapshot and localStorage is its
 * cross-window transport.
 */
let favoritesMemory = null;
let favoritesListening = false;
const favoritesListeners = new Set();

function favoritesSnapshot() {
  if (favoritesMemory === null) favoritesMemory = readState();
  return favoritesMemory;
}

function publishFavorites(next) {
  favoritesMemory = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep working in memory when storage is unavailable.
  }
  for (const listener of favoritesListeners) listener();
}

function updateFavorites(updater) {
  const previous = favoritesSnapshot();
  const next = typeof updater === 'function' ? updater(previous) : updater;
  if (next !== previous) publishFavorites(next);
}

function onFavoritesStorage(event) {
  if (event.key !== STORAGE_KEY || typeof event.newValue !== 'string') return;
  try {
    const next = cleanState(JSON.parse(event.newValue));
    if (next === null || next === favoritesMemory) return;
    favoritesMemory = next;
    for (const listener of favoritesListeners) listener();
  } catch {
    // Ignore another window's malformed write.
  }
}

function subscribeFavorites(listener) {
  favoritesListeners.add(listener);
  if (!favoritesListening) {
    window.addEventListener('storage', onFavoritesStorage);
    favoritesListening = true;
  }
  return () => {
    favoritesListeners.delete(listener);
    if (favoritesListeners.size === 0 && favoritesListening) {
      window.removeEventListener('storage', onFavoritesStorage);
      favoritesListening = false;
    }
  };
}

function useFavorites() {
  const state = useSyncExternalStore(subscribeFavorites, favoritesSnapshot, favoritesSnapshot);
  return [state, updateFavorites];
}

function normalizeUrl(input) {
  let value = input.trim();
  if (value === '') throw new Error('empty');
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) value = 'https://' + value;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('invalid');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error('invalid');
  return parsed.href;
}

function faviconCandidates(url) {
  try {
    const origin = new URL(url).origin;
    return [
      origin + '/favicon.ico',
      origin + '/favicon.svg',
      origin + '/favicon.png',
      origin + '/apple-touch-icon.png',
    ];
  } catch {
    return [];
  }
}

function initialOf(name) {
  const chars = Array.from(name.trim());
  return chars.length === 0 ? '?' : chars[0].toUpperCase();
}

function hasDragType(event, type) {
  const types = event.dataTransfer && event.dataTransfer.types;
  return types !== undefined && Array.from(types).includes(type);
}

function hasFavoriteDrag(event) {
  return hasDragType(event, DRAG_TYPE);
}

function hasCategoryDrag(event) {
  return hasDragType(event, CATEGORY_DRAG_TYPE);
}

function compareCategoryOrder(a, b) {
  return (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name);
}

function compareLinkOrder(a, b) {
  return (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id);
}

function reorderCategories(categories, draggedId, beforeId) {
  if (draggedId === beforeId) return categories;
  const ordered = categories.slice().sort(compareCategoryOrder);
  const dragged = ordered.find((category) => category.id === draggedId);
  if (dragged === undefined) return categories;
  const without = ordered.filter((category) => category.id !== draggedId);
  const index = beforeId === null ? without.length : without.findIndex((category) => category.id === beforeId);
  const insertAt = index < 0 ? without.length : index;
  const next = [...without.slice(0, insertAt), dragged, ...without.slice(insertAt)];
  return next.map((category, order) => ({ ...category, order }));
}

function reorderLinks(links, draggedId, categoryId, beforeId) {
  if (draggedId === beforeId) return links;
  const dragged = links.find((link) => link.id === draggedId);
  if (dragged === undefined) return links;
  const group = links
    .filter((link) => (link.categoryId ?? null) === categoryId)
    .slice()
    .sort(compareLinkOrder);
  const without = group.filter((link) => link.id !== draggedId);
  const index = beforeId === null ? without.length : without.findIndex((link) => link.id === beforeId);
  const insertAt = index < 0 ? without.length : index;
  const nextGroup = [...without.slice(0, insertAt), { ...dragged, categoryId }, ...without.slice(insertAt)];
  const orderById = new Map(nextGroup.map((link, order) => [link.id, order]));
  return links.map((link) =>
    orderById.has(link.id)
      ? { ...link, categoryId, order: orderById.get(link.id) }
      : link,
  );
}

/**
 * Resolve the insertion point under the pointer from the rendered cards. The
 * marker is the vertical line's geometry relative to the grid (the positioned
 * ancestor), so it follows the actual CSS grid rather than an assumed column
 * count.
 */
function computeLinkDrop(grid, clientX, clientY) {
  const gridRect = grid.getBoundingClientRect();
  const cards = Array.from(grid.querySelectorAll('[data-link-id]'));
  const clampLine = (left, top, height) => ({
    left: Math.max(1, Math.min(left, gridRect.width - 2)),
    top,
    height: Math.max(28, height),
  });
  if (cards.length === 0) {
    return { beforeId: null, line: clampLine(1, 4, 48) };
  }

  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
    const rect = card.getBoundingClientRect();
    if (clientY < rect.top) {
      return {
        beforeId: card.getAttribute('data-link-id'),
        line: clampLine(rect.left - gridRect.left, rect.top - gridRect.top, rect.height),
      };
    }
    if (clientY <= rect.bottom) {
      if (clientX < rect.left + rect.width / 2) {
        return {
          beforeId: card.getAttribute('data-link-id'),
          line: clampLine(rect.left - gridRect.left, rect.top - gridRect.top, rect.height),
        };
      }
      return {
        beforeId: cards[index + 1]?.getAttribute('data-link-id') ?? null,
        line: clampLine(rect.right - gridRect.left, rect.top - gridRect.top, rect.height),
      };
    }
  }

  const last = cards[cards.length - 1];
  const rect = last.getBoundingClientRect();
  return {
    beforeId: null,
    line: clampLine(rect.right - gridRect.left, rect.top - gridRect.top, rect.height),
  };
}

/* -------------------------------------------------------------------------- */
/* Artwork                                                                     */
/* -------------------------------------------------------------------------- */

function FavoritesGlyph({ size = 22, className }) {
  return h(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.7,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      className,
      'aria-hidden': 'true',
    },
    h('path', { d: 'M12 3.8l2.55 5.17 5.7.83-4.13 4.02.98 5.68L12 16.81 6.9 19.5l.98-5.68L3.75 9.8l5.7-.83L12 3.8z' }),
  );
}

function PlusIcon() {
  return h('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M8 3.2v9.6M3.2 8h9.6' }));
}

function ChevronIcon({ className }) {
  return h('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', className, 'aria-hidden': 'true' }, h('path', { d: 'M4.5 6.25L8 9.75l3.5-3.5' }));
}

function ChevronDownIcon() {
  return h('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M4 6l4 4 4-4' }));
}

function FolderIcon() {
  return h('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M1.8 4.6c0-.6.5-1.1 1.1-1.1h3l1.3 1.4h5.9c.6 0 1.1.5 1.1 1.1v5.8c0 .6-.5 1.1-1.1 1.1H2.9c-.6 0-1.1-.5-1.1-1.1V4.6z' }));
}

function InboxIcon() {
  return h('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M2 9.2l1.6-4.5c.15-.45.58-.75 1.05-.75h6.7c.47 0 .9.3 1.05.75L14 9.2v3.1c0 .55-.45 1-1 1H3c-.55 0-1-.45-1-1V9.2z' }), h('path', { d: 'M2 9.2h3l1 1.6h4l1-1.6h3' }));
}

function LinkIcon() {
  return h('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M6.5 9.5l3-3M7 4.5l1.2-1.2a2.45 2.45 0 013.5 3.5L10.5 8M9 11.5l-1.2 1.2a2.45 2.45 0 01-3.5-3.5L5.5 8' }));
}

function FolderPlusIcon() {
  return h('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M1.8 4.6c0-.6.5-1.1 1.1-1.1h3l1.3 1.4h5.9c.6 0 1.1.5 1.1 1.1v5.8c0 .6-.5 1.1-1.1 1.1H2.9c-.6 0-1.1-.5-1.1-1.1V4.6z' }), h('path', { d: 'M8 7.2v4M6 9.2h4' }));
}

function PencilIcon() {
  return h('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M10.9 2.6l2.5 2.5-7.6 7.6-3.1.6.6-3.1 7.6-7.6z' }), h('path', { d: 'M9.5 4l2.5 2.5' }));
}

function TrashIcon() {
  return h('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M2.8 4.2h10.4M6.2 4.2V2.9c0-.35.28-.63.63-.63h2.34c.35 0 .63.28.63.63v1.3M4.2 4.2l.6 8.1c.04.5.45.9.96.9h4.48c.5 0 .92-.4.96-.9l.6-8.1' }), h('path', { d: 'M6.6 6.7v4.1M9.4 6.7v4.1' }));
}

function CloseIcon() {
  return h('svg', { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M3.6 3.6l8.8 8.8M12.4 3.6l-8.8 8.8' }));
}

function GripIcon() {
  const dots = [];
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 2; col += 1) {
      dots.push(h('circle', { key: row + '-' + col, cx: 5 + col * 6, cy: 5 + row * 6, r: 1.15 }));
    }
  }
  return h('svg', { viewBox: '0 0 16 16', fill: 'currentColor', 'aria-hidden': 'true' }, dots);
}

function EmptyBookmarkIcon() {
  return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, h('path', { d: 'M6.5 3.5h11v17l-5.5-3.6-5.5 3.6v-17z' }), h('path', { d: 'M9.2 8h5.6' }));
}

/* -------------------------------------------------------------------------- */
/* Small primitives                                                            */
/* -------------------------------------------------------------------------- */

function IconButton({ label, onClick, children, className }) {
  return h(
    'button',
    {
      type: 'button',
      className: 'dshfav-iconBtn' + (className ? ' ' + className : ''),
      'aria-label': label,
      title: label,
      onDragStart: (event) => event.stopPropagation(),
      onClick: (event) => {
        event.stopPropagation();
        event.preventDefault();
        onClick();
      },
    },
    children,
  );
}

function Favicon({ url, name }) {
  const candidates = useMemo(() => faviconCandidates(url), [url]);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setAttempt(0);
  }, [url]);
  const src = candidates[attempt];
  if (src === undefined) {
    return h('span', { className: 'dshfav-initial', 'aria-hidden': 'true' }, initialOf(name));
  }
  return h('img', {
    src,
    alt: '',
    draggable: false,
    loading: 'lazy',
    onError: () => setAttempt((value) => value + 1),
  });
}

function FavoriteCard({ link, dragging, onDragStart, onDragEnd, onEdit, onDelete, t }) {
  return h(
    'article',
    {
      className: 'dshfav-card',
      draggable: true,
      'data-link-id': link.id,
      'data-dragging': dragging ? 'true' : undefined,
      onDragStart: (event) => onDragStart(event, link.id),
      onDragEnd,
    },
    h(
      'a',
      {
        className: 'dshfav-cardLink',
        href: link.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: link.url,
        draggable: false,
      },
      h('span', { className: 'dshfav-icon' }, h(Favicon, { url: link.url, name: link.name })),
      h('span', { className: 'dshfav-name' }, link.name),
    ),
    h(
      'div',
      { className: 'dshfav-cardActions' },
      h(IconButton, { label: t('link.edit'), onClick: () => onEdit(link) }, h(PencilIcon)),
      h(IconButton, { label: t('link.delete'), onClick: () => onDelete(link) }, h(TrashIcon)),
    ),
  );
}

function FavoriteGroup({
  group,
  draggingId,
  draggingCategoryId,
  dropTarget,
  categoryDrop,
  linkDrop,
  onToggle,
  onRename,
  onDelete,
  onGroupDragOver,
  onGroupDragLeave,
  onGroupDrop,
  onCategoryDragStart,
  onCategoryDragEnd,
  onLinkDragOver,
  onLinkDragLeave,
  onLinkDrop,
  onDragEnd,
  onDragStart,
  onEditLink,
  onDeleteLink,
  t,
}) {
  const editable = group.editable === true;
  const collapsed = group.collapsed === true;
  const links = group.links;
  const categoryLine = categoryDrop !== null && categoryDrop.groupId === group.id ? categoryDrop.edge : undefined;
  const linkLine = linkDrop !== null && linkDrop.categoryId === group.id ? linkDrop.line : null;

  return h(
    'section',
    {
      className: 'dshfav-group',
      'data-collapsed': collapsed ? 'true' : undefined,
      'data-drop': dropTarget === group.id ? 'active' : undefined,
      'data-group': group.id,
      'data-cat-drop': categoryLine,
      'data-category-dragging': draggingCategoryId === group.id ? 'true' : undefined,
      onDragOver: (event) => onGroupDragOver(event, group),
      onDragLeave: (event) => {
        if (event.currentTarget.contains(event.relatedTarget) === false) onGroupDragLeave(group.id);
      },
      onDrop: (event) => onGroupDrop(event, group),
    },
    h(
      'div',
      {
        className: 'dshfav-groupHead',
        draggable: editable ? true : undefined,
        onDragStart: editable ? (event) => onCategoryDragStart(event, group.id) : undefined,
        onDragEnd: editable ? onCategoryDragEnd : undefined,
      },
      h(
        'button',
        {
          type: 'button',
          className: 'dshfav-groupToggle',
          'aria-expanded': collapsed ? 'false' : 'true',
          draggable: editable ? true : undefined,
          onDragStart: editable ? (event) => onCategoryDragStart(event, group.id) : undefined,
          onDragEnd: editable ? onCategoryDragEnd : undefined,
          onClick: () => onToggle(group.id),
        },
        h(ChevronIcon, { className: 'dshfav-chev' }),
        h('span', { className: 'dshfav-folder' }, group.uncategorized ? h(InboxIcon) : h(FolderIcon)),
        h('span', { className: 'dshfav-groupName' }, group.name),
        h('span', { className: 'dshfav-count' }, String(links.length)),
      ),
      editable
        ? h(
            'div',
            { className: 'dshfav-groupActions' },
            h(IconButton, { label: t('category.rename'), onClick: () => onRename(group) }, h(PencilIcon)),
            h(IconButton, { label: t('category.delete'), onClick: () => onDelete(group) }, h(TrashIcon)),
          )
        : null,
    ),
    collapsed
      ? null
      : h(
          'div',
          {
            className: 'dshfav-grid',
            onDragOver: (event) => onLinkDragOver(event, group.id),
            onDragLeave: (event) => {
              if (event.currentTarget.contains(event.relatedTarget) === false) onLinkDragLeave(group.id);
            },
            onDrop: (event) => onLinkDrop(event, group.id),
          },
          links.length === 0
            ? h('div', { className: 'dshfav-emptyDrop' }, draggingId === null && draggingCategoryId === null ? t('emptyCategory') : t('dropHere'))
            : links.map((link) =>
                h(FavoriteCard, {
                  key: link.id,
                  link,
                  dragging: draggingId === link.id,
                  onDragStart,
                  onDragEnd,
                  onEdit: onEditLink,
                  onDelete: onDeleteLink,
                  t,
                }),
              ),
          linkLine !== null
            ? h('span', {
                className: 'dshfav-linkDropLine',
                'aria-hidden': 'true',
                style: { left: linkLine.left, top: linkLine.top, height: linkLine.height },
              })
            : null,
        ),
  );
}

/* -------------------------------------------------------------------------- */
/* Dialogs                                                                     */
/* -------------------------------------------------------------------------- */

function Dialog({ title, onClose, children, t }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return h(
    'div',
    {
      className: 'dshfav-overlay',
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) onClose();
      },
    },
    h(
      'div',
      { className: 'dshfav-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      h(
        'div',
        { className: 'dshfav-dialogHead' },
        h('h3', { className: 'dshfav-dialogTitle' }, title),
        h('button', { type: 'button', className: 'dshfav-dialogClose', 'aria-label': t('close'), onClick: onClose }, h(CloseIcon)),
      ),
      children,
    ),
  );
}

function LinkDialog({ mode, link, categories, onCancel, onSave, t }) {
  const [name, setName] = useState(link ? link.name : '');
  const [url, setUrl] = useState(link ? link.url : '');
  const [categoryId, setCategoryId] = useState(link && link.categoryId ? link.categoryId : UNCATEGORIZED);
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    let normalized;
    try {
      normalized = normalizeUrl(url);
    } catch {
      setError(t('error.url'));
      return;
    }
    let finalName = name.trim();
    if (finalName === '') finalName = new URL(normalized).hostname.replace(/^www\./, '');
    onSave({
      name: finalName,
      url: normalized,
      categoryId: categoryId === UNCATEGORIZED ? null : categoryId,
    });
  };

  return h(
    Dialog,
    { title: t(mode === 'edit' ? 'dialog.editLink' : 'dialog.addLink'), onClose: onCancel, t },
    h(
      'form',
      { className: 'dshfav-form', onSubmit: submit },
      h(
        'label',
        { className: 'dshfav-field' },
        h('span', { className: 'dshfav-label' }, t('field.name')),
        h('input', {
          className: 'dshfav-input',
          value: name,
          onChange: (event) => setName(event.target.value),
          placeholder: t('placeholder.name'),
          autoFocus: true,
          spellCheck: false,
          maxLength: 80,
        }),
      ),
      h(
        'label',
        { className: 'dshfav-field' },
        h('span', { className: 'dshfav-label' }, t('field.url')),
        h('input', {
          className: 'dshfav-input',
          value: url,
          onChange: (event) => {
            setUrl(event.target.value);
            if (error !== '') setError('');
          },
          placeholder: t('placeholder.url'),
          inputMode: 'url',
          spellCheck: false,
        }),
      ),
      h(
        'label',
        { className: 'dshfav-field' },
        h('span', { className: 'dshfav-label' }, t('field.category')),
        h(
          'select',
          { className: 'dshfav-select', value: categoryId, onChange: (event) => setCategoryId(event.target.value) },
          h('option', { value: UNCATEGORIZED }, t('uncategorized')),
          categories.map((category) => h('option', { key: category.id, value: category.id }, category.name)),
        ),
      ),
      error !== '' ? h('p', { className: 'dshfav-error', role: 'alert' }, error) : null,
      h(
        'div',
        { className: 'dshfav-dialogActions' },
        h('button', { type: 'button', className: 'dshfav-button', onClick: onCancel }, t('action.cancel')),
        h('button', { type: 'submit', className: 'dshfav-button', 'data-primary': 'true' }, t(mode === 'edit' ? 'action.save' : 'action.add')),
      ),
    ),
  );
}

function CategoryDialog({ mode, category, categories, onCancel, onSave, t }) {
  const [name, setName] = useState(category ? category.name : '');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const value = name.trim();
    if (value === '') {
      setError(t('error.category'));
      return;
    }
    const duplicate = categories.some(
      (entry) => entry.id !== (category ? category.id : '') && entry.name.toLocaleLowerCase() === value.toLocaleLowerCase(),
    );
    if (duplicate) {
      setError(t('error.duplicate'));
      return;
    }
    onSave(value);
  };

  return h(
    Dialog,
    { title: t(mode === 'edit' ? 'dialog.renameCategory' : 'dialog.addCategory'), onClose: onCancel, t },
    h(
      'form',
      { className: 'dshfav-form', onSubmit: submit },
      h(
        'label',
        { className: 'dshfav-field' },
        h('span', { className: 'dshfav-label' }, t('field.name')),
        h('input', {
          className: 'dshfav-input',
          value: name,
          onChange: (event) => {
            setName(event.target.value);
            if (error !== '') setError('');
          },
          placeholder: t('placeholder.category'),
          autoFocus: true,
          maxLength: 40,
        }),
      ),
      error !== '' ? h('p', { className: 'dshfav-error', role: 'alert' }, error) : null,
      h(
        'div',
        { className: 'dshfav-dialogActions' },
        h('button', { type: 'button', className: 'dshfav-button', onClick: onCancel }, t('action.cancel')),
        h('button', { type: 'submit', className: 'dshfav-button', 'data-primary': 'true' }, t(mode === 'edit' ? 'action.save' : 'action.add')),
      ),
    ),
  );
}

function ConfirmDialog({ title, message, confirmLabel, onCancel, onConfirm, t }) {
  return h(
    Dialog,
    { title, onClose: onCancel, t },
    h('p', { className: 'dshfav-confirmText' }, message),
    h(
      'div',
      { className: 'dshfav-dialogActions' },
      h('button', { type: 'button', className: 'dshfav-button', autoFocus: true, onClick: onCancel }, t('action.cancel')),
      h('button', { type: 'button', className: 'dshfav-button', 'data-danger': 'true', onClick: onConfirm }, confirmLabel),
    ),
  );
}

/* -------------------------------------------------------------------------- */
/* Main surface                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({ onAddLink, onAddCategory, t }) {
  return h(
    'div',
    { className: 'dshfav-empty' },
    h('div', { className: 'dshfav-emptyIcon' }, h(EmptyBookmarkIcon)),
    h('h3', { className: 'dshfav-emptyTitle' }, t('emptyTitle')),
    h('p', { className: 'dshfav-emptyBody' }, t('emptyBody')),
    h(
      'div',
      { className: 'dshfav-emptyActions' },
      h('button', { type: 'button', className: 'dshfav-button', 'data-primary': 'true', onClick: onAddLink }, t('addLink')),
      h('button', { type: 'button', className: 'dshfav-button', onClick: onAddCategory }, t('addCategory')),
    ),
  );
}

function FavoritesBody({ t }) {
  const [state, setState] = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [draggingCategoryId, setDraggingCategoryId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [categoryDrop, setCategoryDrop] = useState(null);
  const [linkDrop, setLinkDrop] = useState(null);
  const addRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointerDown = (event) => {
      if (addRef.current !== null && addRef.current.contains(event.target) === false) setMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const orderedCategories = useMemo(
    () => state.categories.slice().sort(compareCategoryOrder),
    [state.categories],
  );

  const sortedLinks = useMemo(
    () => state.links.slice().sort(compareLinkOrder),
    [state.links],
  );

  const groups = useMemo(() => {
    const byCategory = new Map(orderedCategories.map((category) => [category.id, []]));
    const uncategorized = [];
    sortedLinks.forEach((link) => {
      if (link.categoryId !== null && byCategory.has(link.categoryId)) byCategory.get(link.categoryId).push(link);
      else uncategorized.push(link);
    });
    const result = [];
    // Keep the inbox visible as a drop target once anything is saved, even when
    // every site currently lives in a real category.
    if (uncategorized.length > 0 || state.links.length > 0) {
      result.push({
        id: UNCATEGORIZED,
        name: t('uncategorized'),
        uncategorized: true,
        editable: false,
        collapsed: state.uncategorizedCollapsed === true,
        links: uncategorized,
      });
    }
    orderedCategories.forEach((category, index) => {
      result.push({
        id: category.id,
        name: category.name,
        uncategorized: false,
        editable: true,
        collapsed: category.collapsed === true,
        links: byCategory.get(category.id) || [],
        nextCategoryId: orderedCategories[index + 1]?.id ?? null,
      });
    });
    return result;
  }, [orderedCategories, sortedLinks, state.uncategorizedCollapsed, t]);

  const firstCategoryId = orderedCategories[0]?.id ?? null;

  const openAddLink = useCallback(() => setDialog({ type: 'link', mode: 'add', link: null }), []);
  const openAddCategory = useCallback(() => setDialog({ type: 'category', mode: 'add', category: null }), []);
  const openEditLink = useCallback((link) => setDialog({ type: 'link', mode: 'edit', link }), []);
  const openRenameCategory = useCallback((category) => setDialog({ type: 'category', mode: 'edit', category }), []);

  const deleteLink = useCallback((id) => {
    setState((previous) => ({ ...previous, links: previous.links.filter((link) => link.id !== id) }));
  }, [setState]);

  const askDeleteLink = useCallback(
    (link) => {
      setDialog({
        type: 'confirm',
        title: t('confirm.deleteLinkTitle'),
        message: t('confirm.deleteLinkBody', { name: link.name }),
        label: t('confirm.delete'),
        onConfirm: () => deleteLink(link.id),
      });
    },
    [deleteLink, t],
  );

  const askDeleteCategory = useCallback(
    (group) => {
      const category = state.categories.find((entry) => entry.id === group.id);
      if (category === undefined) return;
      const count = state.links.filter((link) => link.categoryId === category.id).length;
      setDialog({
        type: 'confirm',
        title: t('confirm.deleteCategoryTitle', { name: category.name }),
        message: t('confirm.deleteCategoryBody', { count }),
        label: t('confirm.delete'),
        onConfirm: () => {
          setState((previous) => ({
            ...previous,
            uncategorizedCollapsed: false,
            categories: previous.categories.filter((entry) => entry.id !== category.id),
            links: previous.links.map((link) => (link.categoryId === category.id ? { ...link, categoryId: null } : link)),
          }));
        },
      });
    },
    [state.categories, state.links, setState, t],
  );

  const saveLink = useCallback(
    (values) => {
      setState((previous) => {
        const categories = previous.categories.map((category) =>
          values.categoryId !== null && category.id === values.categoryId ? { ...category, collapsed: false } : category,
        );
        if (dialog !== null && dialog.mode === 'edit' && dialog.link !== null) {
          const targetLinks = previous.links.filter(
            (link) => (link.categoryId ?? null) === values.categoryId && link.id !== dialog.link.id,
          );
          const minOrder = targetLinks.reduce((min, link) => Math.min(min, link.order ?? 0), 0);
          return {
            ...previous,
            categories,
            links: previous.links.map((link) =>
              link.id === dialog.link.id
                ? {
                    ...link,
                    name: values.name,
                    url: values.url,
                    categoryId: values.categoryId,
                    order:
                      (link.categoryId ?? null) === values.categoryId
                        ? link.order
                        : minOrder - 1,
                  }
                : link,
            ),
          };
        }
        const targetLinks = previous.links.filter((link) => (link.categoryId ?? null) === values.categoryId);
        const minOrder = targetLinks.reduce((min, link) => Math.min(min, link.order ?? 0), 0);
        return {
          ...previous,
          categories,
          links: [
            {
              id: makeId('link'),
              name: values.name,
              url: values.url,
              categoryId: values.categoryId,
              createdAt: Date.now(),
              order: minOrder - 1,
            },
            ...previous.links,
          ],
        };
      });
      setDialog(null);
    },
    [dialog, setState],
  );

  const saveCategory = useCallback(
    (name) => {
      setState((previous) => {
        if (dialog !== null && dialog.mode === 'edit' && dialog.category !== null) {
          return {
            ...previous,
            categories: previous.categories.map((category) =>
              category.id === dialog.category.id ? { ...category, name } : category,
            ),
          };
        }
        const order = previous.categories.reduce((max, category) => Math.max(max, category.order), 0) + 1;
        return {
          ...previous,
          categories: [
            ...previous.categories,
            { id: makeId('category'), name, collapsed: false, order },
          ],
        };
      });
      setDialog(null);
    },
    [dialog, setState],
  );

  const toggleGroup = useCallback(
    (id) => {
      setState((previous) => {
        if (id === UNCATEGORIZED) {
          return { ...previous, uncategorizedCollapsed: previous.uncategorizedCollapsed !== true };
        }
        return {
          ...previous,
          categories: previous.categories.map((category) =>
            category.id === id ? { ...category, collapsed: category.collapsed !== true } : category,
          ),
        };
      });
    },
    [setState],
  );

  const resetDragState = useCallback(() => {
    setDraggingId(null);
    setDraggingCategoryId(null);
    setDropTarget(null);
    setCategoryDrop(null);
    setLinkDrop(null);
  }, []);

  const onCategoryDragStart = useCallback((event, id) => {
    event.stopPropagation();
    setDraggingCategoryId(id);
    setDraggingId(null);
    setDropTarget(null);
    setCategoryDrop(null);
    setLinkDrop(null);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(CATEGORY_DRAG_TYPE, id);
    event.dataTransfer.setData('text/plain', id);
  }, []);

  const onCategoryDragEnd = useCallback(() => {
    resetDragState();
  }, [resetDragState]);

  const onDragStart = useCallback((event, id) => {
    event.stopPropagation();
    setDraggingId(id);
    setDraggingCategoryId(null);
    setDropTarget(null);
    setCategoryDrop(null);
    setLinkDrop(null);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(DRAG_TYPE, id);
    event.dataTransfer.setData('text/plain', id);
  }, []);

  const onDragEnd = useCallback(() => {
    resetDragState();
  }, [resetDragState]);

  const onGroupDragOver = useCallback(
    (event, group) => {
      const categoryDragging = draggingCategoryId !== null || hasCategoryDrag(event);
      if (categoryDragging) {
        if (hasCategoryDrag(event) === false && draggingCategoryId === null) return;
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move';
        setDropTarget(null);
        setLinkDrop(null);
        if (group.uncategorized) {
          setCategoryDrop({ groupId: group.id, edge: 'after', beforeId: firstCategoryId });
          return;
        }
        const header = event.currentTarget.querySelector('.dshfav-groupHead');
        const rect = header === null ? undefined : header.getBoundingClientRect();
        const before = rect === undefined ? true : event.clientY < rect.top + rect.height / 2;
        setCategoryDrop({
          groupId: group.id,
          edge: before ? 'before' : 'after',
          beforeId: before ? group.id : group.nextCategoryId ?? null,
        });
        return;
      }

      if (draggingId === null && hasFavoriteDrag(event) === false) return;
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'move';
      setDropTarget(group.id);
      setCategoryDrop(null);
      setLinkDrop(null);
    },
    [draggingCategoryId, draggingId, firstCategoryId],
  );

  const onGroupDragLeave = useCallback((id) => {
    setDropTarget((current) => (current === id ? null : current));
    setCategoryDrop((current) => (current !== null && current.groupId === id ? null : current));
    setLinkDrop((current) => (current !== null && current.categoryId === id ? null : current));
  }, []);

  const onGroupDrop = useCallback(
    (event, group) => {
      const categoryId = event.dataTransfer.getData(CATEGORY_DRAG_TYPE);
      if (categoryId !== '') {
        event.preventDefault();
        event.stopPropagation();
        let beforeId = null;
        if (group.uncategorized) beforeId = firstCategoryId;
        else {
          const header = event.currentTarget.querySelector('.dshfav-groupHead');
          const rect = header === null ? undefined : header.getBoundingClientRect();
          const before = rect === undefined ? true : event.clientY < rect.top + rect.height / 2;
          beforeId = before ? group.id : group.nextCategoryId ?? null;
        }
        resetDragState();
        setState((previous) => ({
          ...previous,
          categories: reorderCategories(previous.categories, categoryId, beforeId),
        }));
        return;
      }

      const linkId = event.dataTransfer.getData(DRAG_TYPE) || event.dataTransfer.getData('text/plain');
      if (linkId === '') return;
      event.preventDefault();
      event.stopPropagation();
      const targetCategory = group.uncategorized ? null : group.id;
      resetDragState();
      setState((previous) => ({
        ...previous,
        uncategorizedCollapsed: targetCategory === null ? false : previous.uncategorizedCollapsed,
        categories:
          targetCategory === null
            ? previous.categories
            : previous.categories.map((category) =>
                category.id === targetCategory ? { ...category, collapsed: false } : category,
              ),
        links: reorderLinks(previous.links, linkId, targetCategory, null),
      }));
    },
    [firstCategoryId, resetDragState, setState],
  );

  const onLinkDragOver = useCallback(
    (event, categoryId) => {
      if (draggingCategoryId !== null || hasCategoryDrag(event)) return;
      if (draggingId === null && hasFavoriteDrag(event) === false) return;
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'move';
      const { beforeId, line } = computeLinkDrop(event.currentTarget, event.clientX, event.clientY);
      setDropTarget(categoryId);
      setCategoryDrop(null);
      setLinkDrop({ categoryId, beforeId, line });
    },
    [draggingCategoryId, draggingId],
  );

  const onLinkDragLeave = useCallback((categoryId) => {
    setLinkDrop((current) => (current !== null && current.categoryId === categoryId ? null : current));
  }, []);

  const onLinkDrop = useCallback(
    (event, categoryId) => {
      if (draggingCategoryId !== null || hasCategoryDrag(event)) return;
      const linkId = event.dataTransfer.getData(DRAG_TYPE) || event.dataTransfer.getData('text/plain');
      if (linkId === '') return;
      event.preventDefault();
      event.stopPropagation();
      const { beforeId } = computeLinkDrop(event.currentTarget, event.clientX, event.clientY);
      const targetCategory = categoryId === UNCATEGORIZED ? null : categoryId;
      resetDragState();
      setState((previous) => ({
        ...previous,
        uncategorizedCollapsed: targetCategory === null ? false : previous.uncategorizedCollapsed,
        categories:
          targetCategory === null
            ? previous.categories
            : previous.categories.map((category) =>
                category.id === targetCategory ? { ...category, collapsed: false } : category,
              ),
        links: reorderLinks(previous.links, linkId, targetCategory, beforeId),
      }));
    },
    [draggingCategoryId, resetDragState, setState],
  );

  const categoriesForDialog = orderedCategories.map((category) => ({ id: category.id, name: category.name }));

  return h(
    'div',
    { className: 'dshfav-root' },
    h(
      'header',
      { className: 'dshfav-header' },
      h(
        'div',
        { className: 'dshfav-heading' },
        h('h2', { className: 'dshfav-title' }, t('title')),
        h('p', { className: 'dshfav-subtitle' }, t('summary', { links: state.links.length, categories: state.categories.length })),
      ),
      h(
        'div',
        { className: 'dshfav-addWrap', ref: addRef },
        h(
          'button',
          {
            type: 'button',
            className: 'dshfav-add',
            'aria-haspopup': 'menu',
            'aria-expanded': menuOpen ? 'true' : 'false',
            onClick: () => setMenuOpen((value) => !value),
          },
          h(PlusIcon),
          h('span', null, t('add')),
          h(ChevronDownIcon, { className: 'dshfav-caret' }),
        ),
        menuOpen
          ? h(
              'div',
              { className: 'dshfav-menu', role: 'menu' },
              h(
                'button',
                {
                  type: 'button',
                  role: 'menuitem',
                  onClick: () => {
                    setMenuOpen(false);
                    openAddLink();
                  },
                },
                h(LinkIcon),
                h('span', null, t('addLink')),
              ),
              h(
                'button',
                {
                  type: 'button',
                  role: 'menuitem',
                  onClick: () => {
                    setMenuOpen(false);
                    openAddCategory();
                  },
                },
                h(FolderPlusIcon),
                h('span', null, t('addCategory')),
              ),
            )
          : null,
      ),
    ),
    h(
      'div',
      { className: 'dshfav-scroll' },
      groups.length === 0
        ? h(EmptyState, { onAddLink: openAddLink, onAddCategory: openAddCategory, t })
        : groups.map((group) =>
            h(FavoriteGroup, {
              key: group.id,
              group,
              draggingId,
              draggingCategoryId,
              dropTarget,
              categoryDrop,
              linkDrop,
              onToggle: toggleGroup,
              onRename: openRenameCategory,
              onDelete: askDeleteCategory,
              onGroupDragOver,
              onGroupDragLeave,
              onGroupDrop,
              onCategoryDragStart,
              onCategoryDragEnd,
              onLinkDragOver,
              onLinkDragLeave,
              onLinkDrop,
              onDragStart,
              onDragEnd,
              onEditLink: openEditLink,
              onDeleteLink: askDeleteLink,
              t,
            }),
          ),
    ),
    h('div', { className: 'dshfav-hint' }, h(GripIcon), h('span', null, t('dragHint'))),
    dialog !== null && dialog.type === 'link'
      ? h(LinkDialog, {
          mode: dialog.mode,
          link: dialog.link,
          categories: categoriesForDialog,
          onCancel: () => setDialog(null),
          onSave: saveLink,
          t,
        })
      : null,
    dialog !== null && dialog.type === 'category'
      ? h(CategoryDialog, {
          mode: dialog.mode,
          category: dialog.category,
          categories: state.categories,
          onCancel: () => setDialog(null),
          onSave: saveCategory,
          t,
        })
      : null,
    dialog !== null && dialog.type === 'confirm'
      ? h(ConfirmDialog, {
          title: dialog.title,
          message: dialog.message,
          confirmLabel: dialog.label,
          onCancel: () => setDialog(null),
          onConfirm: () => {
            dialog.onConfirm();
            setDialog(null);
          },
          t,
        })
      : null,
  );
}

function FavoritesTitle({ useTabInfo }) {
  const { tab } = useTabInfo();
  return h(React.Fragment, null, h(FavoritesGlyph, { size: 15, className: 'dshfav-titleGlyph' }), tab.title);
}

/* -------------------------------------------------------------------------- */
/* Plugin wiring                                                               */
/* -------------------------------------------------------------------------- */

const inject = ['slots', 'locale', 'sidebarRightTabs', 'sidebarRight'];

function apply(ctx) {
  const t = ctx.locale.bind(LOCALE_NS);

  ctx.effect(
    () => ctx.locale.register(LOCALE_NS, { zh, en }),
    'favorites: dictionaries',
  );

  ctx.effect(
    () =>
      ctx.sidebarRightTabs.register({
        id: PLUGIN_ID,
        kind: TAB_KIND,
        priority: 'builtin',
        title: () => t('tab.title'),
        guide: [
          {
            id: 'favorites',
            commandId: 'favorites.open',
            order: 30,
            title: () => t('tab.title'),
            description: () => t('tab.description'),
            icon: FavoritesGlyph,
          },
        ],
      }),
    'favorites: tab type',
  );

  ctx.inject(['shortcuts'], (shortcutCtx) => {
    shortcutCtx.effect(
      () =>
        shortcutCtx.shortcuts.register({
          id: 'favorites.open',
          label: () => t('shortcut.open'),
          aliases: ['favorites', '收藏夹'],
          defaults: {
            'desktop:macos': { code: 'KeyP', modifiers: ['primary', 'shift'] },
            'desktop:windows': { code: 'KeyP', modifiers: ['primary', 'shift'] },
            'desktop:linux': { code: 'KeyP', modifiers: ['primary', 'shift'] },
            'web:macos': { code: 'KeyP', modifiers: ['primary', 'shift'] },
            'web:windows': { code: 'KeyP', modifiers: ['primary', 'shift'] },
          },
          regions: ['page', 'editable', 'terminal'],
          modals: [],
          resolve: ({ target: element }) => {
            const target = ctx.sidebarRight.commandTarget(element);
            if (target === undefined) {
              return { status: 'blocked', reason: t('shortcut.noSession') };
            }
            return {
              status: 'handled',
              run: () => {
                ctx.sidebarRight.openTabFromTarget(TAB_KIND, target);
              },
            };
          },
        }),
      'favorites: shortcut',
    );
  });

  ctx.effect(
    () =>
      ctx.slots.inject('sidebar.right.pane.tab', () =>
        ctx.slots.register(
          {
            name: 'sidebar.right.pane.tab',
            key: PLUGIN_ID,
            locale: LOCALE_NS,
          },
          FavoritesBody,
        ),
      ),
    'favorites: tab body',
  );

  ctx.effect(
    () =>
      ctx.slots.inject('sidebar.right.pane.tab.title', () =>
        ctx.slots.register(
          {
            name: 'sidebar.right.pane.tab.title',
            key: PLUGIN_ID,
            locale: LOCALE_NS,
          },
          FavoritesTitle,
        ),
      ),
    'favorites: tab title',
  );

  ctx.effect(() => {
    const cssId = PLUGIN_ID + '/styles';
    const existing = document.querySelector('style[data-plugin-css="' + cssId + '"]');
    if (existing !== null) return undefined;
    const style = document.createElement('style');
    style.dataset.plugin = PLUGIN_ID;
    style.dataset.pluginCss = cssId;
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, 'favorites: styles');
}

exports.inject = inject;
exports.apply = apply;
return module.exports;
  },
});
