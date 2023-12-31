import {
  Tooltip,
  showTooltip,
  StateField,
  EditorView,
  StateEffect,
  Extension,
} from "@uiw/react-codemirror";

const addTooltip = StateEffect.define<{ pos: number; text: string }>();
const filterTooltip = StateEffect.define<null>();

export const cursorTooltipField = StateField.define<readonly Tooltip[]>({
  create() {
    return [];
  },
  update(tooltips, tr) {
    for (let effects of tr.effects) {
      if (effects.is(addTooltip)) tooltips = createTooltip(effects.value);
      if (effects.is(filterTooltip)) tooltips = [];

      if (tr.docChanged) {
      }
    }

    return tooltips;
  },

  provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
});

function createTooltip({
  pos,
  text,
}: {
  pos: number;
  text: string;
}): readonly Tooltip[] {
  return [
    {
      pos: pos,
      above: true,
      create: () => {
        let dom = document.createElement("div");
        dom.className = "cm-tooltip-cursor";
        let arrow = document.createElement("div");
        let textIndcator = document.createElement("div");
        textIndcator.textContent = text;
        textIndcator.className =
          "px-2 -mx-[15px] bg-slate-800 text-sm rounded-sm text-green-200 border-2 border-green-200 flex justify-center items-center";
        dom.appendChild(textIndcator);
        arrow.className =
          "absolute h-full border-l-2 border-dotted border-green-200 -mx-[1px]";
        dom.appendChild(arrow);
        return { dom };
      },
    },
  ];
}

const cursorTooltipBaseTheme = EditorView.baseTheme({
  ".cm-tooltip.cm-tooltip-cursor": {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    // padding: "2px 7px",
    // borderRadius: "4px",
    "& .cm-tooltip-arrow:before": {
      borderTopColor: "#66b",
    },
    "& .cm-tooltip-arrow:after": {
      borderTopColor: "transparent",
    },
  },
});

export { addTooltip, filterTooltip };

export const tooltipExtension: Extension = [
  cursorTooltipField,
  cursorTooltipBaseTheme,
];
