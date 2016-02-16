/** 
* Scene interface
* Not used anywhere. Merely a guideline. 
*/
SURVEYOR.Scene = function() { };
SURVEYOR.Scene.prototype = {
	self() {
		return this;
	},
	tick() {
		throw new Error("Implement this!");
	},
	handleMouse() {
		throw new Error("Implement this!");
	},
	checkClicked() {
		throw new Error("Implement this!");
	},
	forceRedraw() {
		throw new Error("Implement this!");
	},
	init() {
		throw new Error("Implement this!");
	}
};