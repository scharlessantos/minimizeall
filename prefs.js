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

const Gtk = imports.gi.Gtk;


let extension = imports.misc.extensionUtils.getCurrentExtension();
const convenience = extension.imports.convenience;

const MESSAGE = 'message';
const MESSAGE_TWEENER = 'tweener';
const MESSAGE_NOTIFICATION = 'notifica';
const MESSAGE_NONE = 'none';

const Gettext = imports.gettext.domain('minimizeall');
const _ = Gettext.gettext;

let settings;

function init() {
	settings = convenience.getSettings(extension);
	convenience.initTranslations("minimizeall");
}

function buildPrefsWidget() {
	let frame = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL,
		border_width: 10, margin: 20});

	frame.add(_createComboBox('message', _("Show alert message as"), _("How to show message \"Showing desktop from current workspace\""),
{'tweener': _("Tweener"), 'notifica' : _("Notification"), 'none' : _("None")}));

	frame.show_all();
	return frame;
}


// Function based on _createComboBox from extension lockkeys@vaina.lt
function _createComboBox(key, text, tooltip, values)
{
	let box = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
	let label = new Gtk.Label({ label: text, xalign: 0, tooltip_text:tooltip });
	let widget = new Gtk.ComboBoxText();

	for (id in values) {
		widget.append(id, values[id]);
	}

	widget.set_active_id(settings.get_string(key));
	widget.connect('changed', function(combo_widget) {
		settings.set_string(key, combo_widget.get_active_id());
	});
	box.pack_start(label, true, true, 0);
	box.add(widget);

	return box;
}
