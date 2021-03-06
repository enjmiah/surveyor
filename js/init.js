"use strict";
var scene1 = new SURVEYOR.Scene1(),
    scene2 = new SURVEYOR.Scene2(),
    scene3 = new SURVEYOR.Scene3(),
    scene4 = new SURVEYOR.Scene4(),
    scenes = [scene1, scene2, scene3, scene4];  //TODO: add all scenes

for (var i = 0, len = scenes.length; i < len; i++)
  scenes[i].init();

/** Ticks all of the scenes. */
(function tickAll() {
  setTimeout(function() {
    window.requestAnimFrame(tickAll);
    SURVEYOR.timeElapsed = Date.now() - START_TIME;
    updateVisible();
    
//    TODO: uncomment
//    for (var i = 0, len = scenes.length; i < len; i++)
//      scenes[i].tick();
    
    scene1.tick();
    scene2.tick();
    //scene3.tick();
    scene4.tick();
    //TODO: call tick() on all scenes
  }, 1000 / 30);
})();

/** Resizes all the scenes mainly. Calls forceRedraw() on each scene. */
function forceRedraw() {
	var v = viewport();
  SURVEYOR.SURVEYOR.viewportWidth = v.width;
  SURVEYOR.SURVEYOR.viewportHeight = v.height;
  SURVEYOR.wScaleFactor = v.width / 2000;
  SURVEYOR.hScaleFactor = v.height / 1000;
  
  for (var i = 0, len = scenes.length; i < len; i++)
    scenes[i].forceRedraw();
}
window.addEventListener("resize", forceRedraw, false);

SURVEYOR.DialogManager.refreshConditionalDisplay();
