"use strict";
/**
* Stores chosen dialog paths and deals with displaying dialog functionality.
* Note this is a static class.
*/
SURVEYOR.DialogManager = (function() {
	var SHOW_ANIM_DURATION = 140,
			HIDE_ANIM_DURATION = 160,
			SHOW_TEXT_ANIM_DURATION = 1500,
			animQueue = $({}),
			history = {},
			sceneStates = {},
			overlayAnimProgress = {}, i;
	for (i = 1; i <= NUM_SCENES; i++) {
		sceneStates[i] = false;
		overlayAnimProgress[i] = false;
	}

	/**
	* Stores a dialog choice.
	* @param {String} k A key to store a value.
	* @param {String | Boolean} v The value to store.
	*/
	var putChoice = function(k, v) {
		history[k] = v;
		refreshConditionalDisplay(k);
	};

	/**
	* Retrieves a dialog choice.
	* @param {String} k The key.
	*/
	var getChoice = function(k) {
		return history[k];
	};

	/**
	* Displays a dialog box for the scene specified.
	* @param {Num} scene The scene on which the dialog box should appear.
	* @param {Num} id The div id of the dialog box which should appear.
	*/
	var displayDialog = function(scene, id) {
		if (sceneStates[scene] !== id) {
			var callback = function() {
				$("#" + id).slideDown(SHOW_ANIM_DURATION);
			},
					state = sceneStates[scene];

			if (state !== false) {
				animQueue.finish().queue("fx", function() {
					$("#" + state).fadeOut(HIDE_ANIM_DURATION, callback).dequeue();
				});
			} else {
				animQueue.finish().queue("fx", function() {
					$("#scene" + scene + "-text").fadeOut(HIDE_ANIM_DURATION, callback).dequeue();
				});
			}
			sceneStates[scene] = id;
		}
	};

	/**
	* Hides dialog box for the scene specified.
	* @param {Num} scene The scene on which the dialog box should be cleared.
	*/
	var hideDialog = function(scene) {
		var state = sceneStates[scene];

		if (state !== false) {
			animQueue.finish().queue("fx", function() {
				$("#" + state).fadeOut(HIDE_ANIM_DURATION).dequeue();
			});
		} else {
			animQueue.finish().queue("fx", function() {
				$("#scene" + scene + "-text").fadeOut(HIDE_ANIM_DURATION).dequeue();
			});
		}
	};

	/**
	* Restores initial text for the scene specified.
	* @param {Num} scene The scene which should be restored.
	*/
	var restoreDialog = function(scene) {
		var callback = function() {
			$("#scene" + scene + "-text").fadeIn(SHOW_TEXT_ANIM_DURATION);
		},
				state = sceneStates[scene];

		if (state !== false) {
			animQueue.finish().queue("fx", function() {
				$("#" + state).fadeOut(HIDE_ANIM_DURATION, callback).dequeue();
			});
		} else {
			animQueue.finish().queue("fx", function() {
				$("#scene" + scene + "-text").fadeOut(HIDE_ANIM_DURATION, callback).dequeue();
			});
		}
		sceneStates[scene] = false;
	};

	/**
	* Changes the overlay colour of a scene. Technically should be in a different
	* class, maybe.
	* @param scene {Num} The scene's overlay to animate.
	* @param colour {String} The colour to change it to.
	* @param options {Object} An object with any of the fields:
	*   opacity: {Num} Opacity (from 0 to 1).
	*   duration: {Num} Animation duration in ms. Defaults to 10000.
	*   callback: {Function} Function to call when animation completes.
	*/
	var setOverlay = function(scene, colour, options) {
		var duration = (options.duration === undefined ? 10000 : options.duration),
				opacity = (options.opacity === undefined ?
									 $("overlay" + scene).css("opacity") : options.opacity),
				callback = options.callback || function() {};

		if (!overlayAnimProgress[scene]) {
			if (duration < 1001)
				overlayAnimProgress[scene] = true;
			$("#overlay" + scene).finish().animate(
				{backgroundColor: colour, opacity: opacity}, duration, "linear",
				function() {callback(); overlayAnimProgress[scene] = false;}
			);
		} else {
			$("#overlay" + scene).animate(
				{backgroundColor: colour, opacity: opacity}, duration, "linear", callback
			);
		}
	};
	
	/**
	* Makes sure all conditional displays are displaying or hiding properly.
	* @param {String} cl The conditional display class to update. Leave empty to
	*   update all.
	*/
	var refreshConditionalDisplay = function(cl) {
		console.log("Refreshed conditional text display!");
		if (cl === "needToLightFire" || cl === undefined) {
			$(".needToLightFire").toggle(getChoice("needToLightFire") === true);
			$(".notNeedToLightFire").toggle(getChoice("needToLightFire") !== true);
			if (typeof cl === "string") return;
		}
		if (cl === "radioListen1" || cl === undefined) {
			$(".slept").toggle(getChoice("radioListen1") !== undefined);
			$(".notSlept").toggle(getChoice("radioListen1") === undefined);
			$(".rememberedFireflies").toggle(getChoice("radioListen1") === "party");
			$(".notRememberedFireflies").toggle(getChoice("radioListen1") !== "party");
			if (typeof cl === "string") return;
		}
		if (cl === "isJarOpen" || cl === undefined) {
			$(".isJarOpen").toggle(getChoice("isJarOpen") === true);
			$(".notIsJarOpen").toggle(getChoice("isJarOpen") !== true);
			if (typeof cl === "string") return;
		}
		if (cl === "fireLit" || cl === undefined) {
			$(".fireLit").toggle(getChoice("fireLit") === true);
			$(".notFireLit").toggle(getChoice("fireLit") !== true);
			if (typeof cl === "string") return;
		}
	};
	
	return {
		putChoice: putChoice,
		getChoice: getChoice,
		displayDialog: displayDialog,
		hideDialog: hideDialog,
		restoreDialog: restoreDialog,
		setOverlay: setOverlay,
		refreshConditionalDisplay: refreshConditionalDisplay
	};
})();