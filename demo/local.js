/*	MooCS.js
	2010-10-19
	Carson S. Christian
	cchristian@moocsinterface.net
	
	Local code for the Mooks test page.
*/
/*
	This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License.
	To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/
	or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
/*global $$, MooCS, Element, JSChart, typeOf */
window.addEvent('domready', function () {
	var addDevice;
	
	// Page header details
	$$('div.stackRight.library span').set('text', MooCS.$libraryVersion);
	
	addDevice = function (name, address) {
		if (typeOf(name) !== 'string' || typeOf(address) !== 'string' || name.length < 1 || address.length < 7) {
			alert('Supply a text name and TCP/IP address for the new contoller first.\n\nAddress should be in the form:\n192.168.0.1:80\nPort number is optional.');
			return;
		}
		// Initialize a new controller
		var controller = new MooCS.Device(name, address, function () {
			var instanceID = String.uniqueID(),
				chartData0 = [],
				chartData1 = [],
				chartData2 = [],
				chartData3 = [],
				chartCounter = 0,
				autoUpdateChart, chart, output, collapse;
			
			// Build example boxes for all supported dictionary entries
			document.id('raw').adopt(
				new Element('h2#rawHeader' + instanceID + '.sectionToggle', {
					text: this.name + ' Raw Values'
				}),
				new Element('h3#connectionQuality' + instanceID, {
					text: 'Connection quality: Good'
				}),
				new Element('div#output' + instanceID)
			);
			(function () {
				var sum = 0,
					average = 0,
					ratings = {
						'-0.1': 'Excellent',
						'0.3': 'Good',
						'1.0': 'Degraded',
						'1.5': 'Poor',
						'3.0': 'Terrible'
					},
					rating = undefined;
				
				controller.communications.responseTimes.each(function (t) {
					sum += t;
				});
				average = (sum / controller.communications.responseTimes.length).round(1);
				Object.each(ratings, function (r, k) {
					if (Number.from(k) < average) {
						rating = r;
					}
				});
				document.id('connectionQuality' + instanceID).set('text', 'Connection quality: ' + rating + ' (' + average + ' seconds lag average, ' + controller.communications.responseTimes.length + ' samples)');
			}).periodical(100);
			collapse = new Collapsible('rawHeader' + instanceID, 'output' + instanceID);
			output = document.id('output' + instanceID);
			Object.each(this.getCapabilities(), function (keys, section) {
				var sectionEl = new Element('div.section');

				output.grab(sectionEl);
				sectionEl.grab(new Element('h1', {
					text: section
				}));
				sectionEl.grab(new Element('input[type=button]', { value: 'Refresh' }).addEvent('click', function () {
					sectionEl.getElements('p').destroy();
					keys.each(function (key) {
						var p = new Element('p');
						sectionEl.grab(p);
						this.read(section, key, function (response) {
							p.set('html', key + ': <strong>' + response + '</strong>');
						}, true);
					}.bind(this));
				}.bind(this)));
			}, this);
			// Activity Indicator
			this.addActivityListener(function (active) {
				document.id('rawHeader' + instanceID)[(active) ? 'addClass' : 'removeClass']('running');
			});
			// Chart
			document.id('charts').grab(new Element('div#chart' + instanceID + '.chart'));
			chart = new JSChart('chart' + instanceID, 'line');
			chart.setTitle(controller.name + ', ' + this.location + ' - ' + ((this.BCS460) ? 'BCS-460' : (this.BCS462) ? 'BCS-462' : 'Unknown'));
			chart.setAxisNameX('Seconds Elapsed');
			chart.setAxisNameY('F');
			(function () { chartCounter += 1; }).periodical(1000);
			this.addUpdateListener('temp', 'value0', function (r) {
				var v = Math.round(r);

				if (typeOf(v) === 'number') {
					chartData0.push([chartCounter, v]);
					if (chartData0.length > 2000) {
						chartData0.splice(0, chartData0.length - 2000);
					}
				}
			});
			this.addUpdateListener('temp', 'value1', function (r) {
				var v = Math.round(r);

				if (typeOf(v) === 'number') {
					chartData1.push([chartCounter, v]);
					if (chartData1.length > 2000) {
						chartData1.splice(0, chartData1.length - 2000);
					}
				}
			});
			this.addUpdateListener('temp', 'value2', function (r) {
				var v = Math.round(r);

				if (typeOf(v) === 'number') {
					chartData2.push([chartCounter, v]);
					if (chartData2.length > 2000) {
						chartData2.splice(0, chartData2.length - 2000);
					}
				}
			});
			this.addUpdateListener('temp', 'value3', function (r) {
				var v = Math.round(r);

				if (typeOf(v) === 'number') {
					chartData3.push([chartCounter, v]);
					if (chartData3.length > 2000) {
						chartData3.splice(0, chartData3.length - 2000);
					}
				}
			});
			autoUpdateChart = function () {
				if (chartData0.length < 1 || chartData1.length < 1 || chartData2.length < 1 || chartData3.length < 1) {
					return;
				}
				chart.setDataArray(chartData0, '0');
				chart.setDataArray(chartData1, '1');
				chart.setDataArray(chartData2, '2');
				chart.setDataArray(chartData3, '3');
				chart.setLineColor('#961703', '0');
				chart.setLineColor('#331595', '1');
				chart.setLineColor('#3c7d96', '2');
				chart.setLineColor('#4b9531', '3');
				chart.draw();
			}.periodical(5000);
			// Turn on polling
			document.id('autoRefresh').set('checked', true).fireEvent('change');
		});
	};
	// Polling
	document.id('autoRefresh').addEvent('change', function () {
		Object.each(MooCS.$instances, function (c) {
			c[this.get('checked') ? 'startPolling' : 'stopPolling'](1000);
		}, this);
	});
	
	// Default Controllers
	// addDevice('DemoBCS', 'ecc.webhop.org:8081');
	addDevice('myBCS', '192.168.110.6');
	
	// Add Device Input
	document.id('buttonAddDevice').addEvent('click', function () {
		addDevice(document.id('input_Name').get('value'), document.id('input_Address').get('value'));
	});
});