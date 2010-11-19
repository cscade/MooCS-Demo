/*	Collapsible.js
	3/19/2010
	Carson Christian
	
	Collapsible page sections made easy.
	Requires Fx.Reveal (mootools more)
*/
/*global $$, MooCS, Element, Class, Request, typeOf, JSChart, Fx */
Collapsible = new Class({
	Extends: Fx.Reveal,
	initialize: function (clicker, section, options) {
		if (clicker) {
			this.clicker = document.id(clicker).addEvent('click', function () {
				if (this.clicker.hasClass('sectionToggle')) {
					// sectionToggles are headers that provide simple disclosure behavior.
					if (this.clicker.hasClass('closed')) {
						this.clicker.removeClass('closed');
						this.clicker.set('text', this.clicker.get('text').replace('Click to show ', ''));
					} else {
						this.clicker.addClass('closed');
						this.clicker.set('text', 'Click to show ' + this.clicker.get('text'));
					}
				}
				this.toggle.apply(this);
			}.bind(this));
			if (this.clicker.hasClass('sectionToggle')) {
				this.clicker.set('title', 'Click to Show/Hide this section.');
			}
		}
		this.parent(document.id(section), options);
	}
});