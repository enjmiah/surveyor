"use strict";
/** An npc firefly. */
SURVEYOR.Firefly = function(x, y, size, angle) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.dsize = Math.random() < 0.5 ? -1 : 1;
	this.angle = angle * Math.PI / 180;
	this.follow = false;
};