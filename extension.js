
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Shell = imports.gi.Shell;
const ExtensionUtils = imports.misc.extensionUtils;
const Meta = ExtensionUtils.getCurrentExtension();
const Utils = Meta.imports.utils;
const Lang = imports.lang;

const Gettext = imports.gettext.domain('minimizeall');
const _ = Gettext.gettext;

let text, button, settings;

function _hide() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _notify() {
    if (!text) {
        text = new St.Label({ style_class: 'notify-label', text: "Showing desktop for current workspace" });
        Main.uiGroup.add_actor(text);
    }

    text.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    text.set_position(Math.floor(monitor.width / 2 - text.width / 2),
                      Math.floor(monitor.height / 2 - text.height / 2));

    Tweener.addTween(text,
                     { opacity: 0,
                       time: 8,
                       transition: 'easeOutQuad',
                      onComplete: _hide});
}

function _minimize() {
    _notify();
        let activeWorkspace = global.screen.get_active_workspace();
    let tracker = Shell.WindowTracker.get_default();
    let windows = activeWorkspace.list_windows();
    for (let i = 0; i < windows.length; i++) {
           //New in V3&4: tracker.is_window_interesting checks whether this is a real window and not a desktop icon
           if (!windows[i].minimized && tracker.is_window_interesting(windows[i])) {
	       windows[i].minimize();
           }
    }
    Main.overview.hide();
}

function init(extensionMeta) {
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(extensionMeta.path + "/icons");

    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let icon = new St.Icon({ icon_name: 'minimize-symbolic',
                             style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', _minimize);

    settings = Utils.getSettings(Meta);
    Utils.initTranslations("minimizeall");
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
};

