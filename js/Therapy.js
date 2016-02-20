SURVEYOR.Therapy = (function() {
  /**
  * Begin a breathing exercise.
  *   This looks worse than it is! Originally it was done iteratively, but the
  *   timing had to be tweaked too much in order for it to be *just right*.
  */
  var begin = function() {
    $(".ok").fadeOut(150, function() {
      $(".breathingExercise").fadeIn(150, function() {
        const FADE_DUR = 1100,
              COUNT_DUR = 1150, // slightly slower feels less rushed
              OFFSET_DUR = 230; // some extra time to read the starting text

        // In . . .
        $(".in1").fadeIn(FADE_DUR);
        setTimeout((function() {
          $(".in2").fadeIn(FADE_DUR);
        }), COUNT_DUR + OFFSET_DUR);
        setTimeout((function() {
          $(".in3").fadeIn(FADE_DUR);
        }), 2 * COUNT_DUR + OFFSET_DUR);
        setTimeout((function() {
          $(".in4").fadeIn(FADE_DUR);
        }), 3 * COUNT_DUR + OFFSET_DUR);
        // Hold . . .
        setTimeout((function() {
          $(".hold1").fadeIn(FADE_DUR);
        }), 4 * COUNT_DUR + OFFSET_DUR);
        setTimeout((function() {
          $(".hold2").fadeIn(FADE_DUR);
        }), 5 * COUNT_DUR + 2 * OFFSET_DUR);
        setTimeout((function() {
          $(".hold3").fadeIn(FADE_DUR);
        }), 6 * COUNT_DUR + 2 * OFFSET_DUR);
        setTimeout((function() {
          $(".hold4").fadeIn(FADE_DUR);
        }), 7 * COUNT_DUR + 2 * OFFSET_DUR);
        setTimeout((function() {
          $(".hold5").fadeIn(FADE_DUR);
        }), 8 * COUNT_DUR + 2 * OFFSET_DUR);
        setTimeout((function() {
          $(".hold6").fadeIn(FADE_DUR);
        }), 9 * COUNT_DUR + 2 * OFFSET_DUR);
        setTimeout((function() {
          $(".hold7").fadeIn(FADE_DUR);
        }), 10 * COUNT_DUR + 2 * OFFSET_DUR);
        // Out . . .
        setTimeout((function() {
          $(".out1").fadeIn(FADE_DUR);
        }), 11 * COUNT_DUR + 2 * OFFSET_DUR);
        setTimeout((function() {
          $(".out2").fadeIn(FADE_DUR);
        }), 12 * COUNT_DUR + 3 * OFFSET_DUR);
        setTimeout((function() {
          $(".out3").fadeIn(FADE_DUR);
        }), 13 * COUNT_DUR + 3 * OFFSET_DUR);
        setTimeout((function() {
          $(".out4").fadeIn(FADE_DUR);
        }), 14 * COUNT_DUR + 3 * OFFSET_DUR);
        setTimeout((function() {
          $(".out5").fadeIn(FADE_DUR);
        }), 15 * COUNT_DUR + 3 * OFFSET_DUR);
        setTimeout((function() {
          $(".out6").fadeIn(FADE_DUR);
        }), 16 * COUNT_DUR + 3 * OFFSET_DUR);
        setTimeout((function() {
          $(".out7").fadeIn(FADE_DUR);
        }), 17 * COUNT_DUR + 3 * OFFSET_DUR);
        setTimeout((function() {
          $(".out8").fadeIn(FADE_DUR);
        }), 18 * COUNT_DUR + 3 * OFFSET_DUR);
        setTimeout((function() {
          $(".afterExercise").fadeIn(FADE_DUR + 100);
        }), 19 * COUNT_DUR + 4 * OFFSET_DUR);
      });
    });
  };

  /**
  * Reset the breathing exercise.
  */
  var again = function() {
    $(".ok").show();
    $(".breathingExercise, .in1, .in2, .in3, .in4, .hold1, .hold2, .hold3, .hold4, .hold5, .hold6, .hold7, .out1, .out2, .out3, .out4, .out5, .out6, .out7, .out8, .afterExercise").hide();
  };

  return {
    begin: begin,
    again: again
  };
})();
