import {
  StateEffect,
  StateField,
  Tooltip,
  showTooltip,
} from "@uiw/react-codemirror";
import { cn } from "../utils";

export const addFeedback = StateEffect.define<{
  pos: number;
  score: number;
}>();
export const filterFeedback = StateEffect.define();

export const feedbackField = StateField.define<readonly Tooltip[]>({
  create() {
    return [];
  },
  update(tooltips, tr) {
    for (let effects of tr.effects) {
      if (effects.is(addFeedback)) {
        let score = effects.value.score;
        let className = "",
          text = `${score}`;
        score = score / 2;

        if (score >= 0) {
          className = "font-extralight border-red-300";
        }
        if (score >= 10) {
          className = "font-extralight border-red-300/80";
        }
        if (score >= 25) {
          className = "font-light border-red-300/60";
        }
        if (score >= 50) {
          className = "font-medium border-yellow-300/80";
        }
        if (score >= 75) {
          className = "font-semibold border-yellow-300/60";
        }
        if (score >= 100) {
          className = "font-bold border-green-300/80";
        }
        if (score >= 200) {
          className = "font-extrabold border-green-300";
        }
        tooltips = createFeedback(effects.value.pos, text, className);
      }
      if (effects.is(filterFeedback)) tooltips = [];
    }

    return tooltips;
  },
  provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
});

const createFeedback = (
  pos: number,
  text: string,
  className = "",
): readonly Tooltip[] => [
  {
    pos: pos,
    above: false,
    arrow: false,
    create: () => {
      let dom = document.createElement("div");
      dom.className = cn(
        "border-2 mt-2 px-2 py-1 rounded-lg text-sm",
        className,
      );
      dom.textContent = text;
      return { dom };
    },
  },
];
