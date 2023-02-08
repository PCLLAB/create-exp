import "jspsych/css/jspsych.css";
import "./style.css";

import jsPsychFullscreen from "@jspsych/plugin-fullscreen";
import { initJsPsych } from "jspsych";

const jsPsych = initJsPsych();

const fullscreenTrial = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
};

jsPsych.run([fullscreenTrial]);
