/*	2010-10-27
	Carson S. Christian
	cchristian@moocsinterface.net
	
	Local code for the Mooks page.
*/
window.addEvent('domready', function () {
	var faded = false,
		fx = new Fx.Tween(document.id('forkMe'), {
			duration: 100,
			property: 'opacity'
		});
	document.addEvent('scroll', function () {
		var scroll = document.getScroll().y;
		
		if (faded === false && scroll > 10) {
			fx.set(0.2);
			faded = true;
		} else if (faded === true && scroll < 10) {
			fx.set(1);
			faded = false;
		}
	});
	document.id('forkMe').addEvents({
		mouseenter: function () {
			if (faded === true) {
				fx.start(1);
			}
		},
		mouseleave: function () {
			if (faded === true) {
				fx.start(0.2);
			}
		}
	});
});