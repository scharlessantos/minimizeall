/*
  Copyright (c) 2013-2014, Charles Santos Silva (silva.charlessantos@gmail.com)

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Shell = imports.gi.Shell;

let extension = imports.misc.extensionUtils.getCurrentExtension();
const convenience = extension.imports.convenience;

const Gettext = imports.gettext.domain('minimizeall');
const _ = Gettext.gettext;

let text, button, settings;

function _hide() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _notify() {
    if (isShowMessage()){
	let msg = _("Showing desktop from current workspace");

	if (isMessageTweener()){

	
	    if (!text) {
		text = new St.Label({ style_class: 'notify-label', text: msg });
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
	} else 
   	    Main.notify(msg);
   }

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
    settings = convenience.getSettings(extension);
	convenience.initTranslations("minimizeall");

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
}

function isShowMessage(){
    let msgtype = settings.get_string('message');
    return !(msgtype == 'none');
}

function isMessageTweener(){
    let msgtype = settings.get_string('message');
    return msgtype == 'tweener';
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
};

