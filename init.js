scene1.init();
scene2.init();
scene3.init();
/* scene4.init(); */
//TODO: call init() on all scenes

window.addEventListener("resize", forceRedraw, false);

refreshConditionalDisplay();


tickAll();