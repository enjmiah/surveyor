"use strict";
/**
* SURVEYOR: An interactive art project
* @author enjmiah / http://jerryyin.me
*/
var SURVEYOR = (function() {
	var v = viewport(),
			vW = v.width,
			vH = v.height;
	
	return {
		viewportWidth: vW,
		viewportHeight: vH,
		wScaleFactor: vW / 2000,
		hScaleFactor: vH / 1000,
		timeElapsed: 0,
		isVisible: [null, false, false, false, false, false], // 1-indexed

		/**
		* Activate debug mode.
		* 	TODO: remove in final code
		*/
		debug() {
			setInterval(function() {
				var str = "";
				if(this.SURVEYOR.isVisible[1])
					str += "1 ";
				if(this.SURVEYOR.isVisible[2])
					str += "2 ";
				if(this.SURVEYOR.isVisible[3])
					str += "3 ";
				if(this.SURVEYOR.isVisible[4])
					str += "4 ";
				//console.log("VISIBLE:", str);

				//console.log("VW:", SURVEYOR.viewportWidth, "VH:", SURVEYOR.viewportHeight);

				//console.log(getChoice("radioListen1"));
			}, 3000);
		}
	};
})();
//SURVEYOR.debug(); // turn Debug mode on

const START_TIME = Date.now(),
			DIR = "assets/",
			NUM_SCENES = 4; // TODO: update this num



/**
* Various global helpers and function aliases.
*/

/** Calculates viewport size */
function viewport() {
	var scene = $("#scene1");
	return {
		width: scene.width(),
		height: scene.height()
	};
}


/**
* Determine if a certain scene is visible in the viewport and should be ticked.
* @param {Int} Scene # to be evaluated. First scene is 1.
*/
function updateVisible() {
	var scroll = (document.documentElement && document.documentElement.scrollTop) ||
				document.body.scrollTop,
			sceneHeight = viewport().height;

	SURVEYOR.isVisible.fill(false, 1);

	if (scroll === 0)
		SURVEYOR.isVisible[1] = true;
	else if (scroll < sceneHeight)
		SURVEYOR.isVisible[1] = SURVEYOR.isVisible[2] = true;
	else if (scroll === sceneHeight)
		SURVEYOR.isVisible[2] = true;
	else if (scroll < 2 * sceneHeight)
		SURVEYOR.isVisible[2] = SURVEYOR.isVisible[3] = true;
	else if (scroll === 2 * sceneHeight)
		SURVEYOR.isVisible[3] = true;
	else if (scroll < 3 * sceneHeight)
		SURVEYOR.isVisible[3] = SURVEYOR.isVisible[4] = true;
	else if (scroll >= 3 * sceneHeight)
		SURVEYOR.isVisible[4] = true;
}


/**
* Pads a number with leading zeros. Useful for filenames generated automatically
*   by Adobe Photoshop. Source: http://gist.github.com/andrewrk/4382935
* @param {Int} number The number to be padded.
* @param {Int} size The size you want the number to be padded to.
*/
function zeroFill(number, size) {
	number = number.toString();
	while (number.length < size) number = "0" + number;
	return number;
}


/**
* Clamps a number within an interval.
* Requires min <= max
* @param {Number} num The number to be clamped
* @param {Number} min The minimum value num is allowed to take on
* @param {Number} max The maximum value num is allowed to take on
*/
function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}


/** Allows shorter method for calling SURVEYOR.DialogManager.displayDialog() */
function displayDialog(scene, id) {
	SURVEYOR.DialogManager.displayDialog(scene, id);
}


/** Allows shorter method for calling SURVEYOR.DialogManager.restoreDialog() */
function restoreDialog(scene) {
	SURVEYOR.DialogManager.restoreDialog(scene);
}


/** Allows shorter method for calling SURVEYOR.DialogManager.setOverlay() */
function setOverlay(scene, colour, options) {
	SURVEYOR.DialogManager.setOverlay(scene, colour, options);
}


/** Allows shorter method for calling SURVEYOR.DialogManager.putChoice() */
function putChoice(k, v) {
	SURVEYOR.DialogManager.putChoice(k, v);
	// TODO: Remove this
	console.log("Set", k, "to", SURVEYOR.DialogManager.getChoice(k));
}


/** Allows shorter method for calling SURVEYOR.DialogManager.getChoice() */
function getChoice(k) {
	return SURVEYOR.DialogManager.getChoice(k);
}
