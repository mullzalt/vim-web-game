import { vim } from "@replit/codemirror-vim";
import { EditorView, Extension, Prec } from "@uiw/react-codemirror";

const [vimStyle, vimPlugin, _hideNativeSelection, vimPanel] = vim({
  status: true,
}) as Extension[];

const vimCursor = Prec.highest(
  EditorView.theme({
    ".cm-vimMode .cm-line": {
      "& ::selection": { backgroundColor: "transparent !important" },
      "&::selection": { backgroundColor: "transparent !important" },
      caretColor: "transparent !important",
    },
    ".cm-fat-cursor": {
      position: "absolute",
      background: "#ffffff69",
      border: "none",
      whiteSpace: "pre",
    },
    "&:not(.cm-focused) .cm-fat-cursor": {
      background: "none",
      outline: "solid 1px #ffffff69",
      color: "transparent !important",
    },
  }),
);

export const vimMode: Extension = [vimCursor, vimStyle, vimPlugin, vimPanel];

// export function vimMode() {
//   return [vimCursor, vimStyle, vimPlugin, vimPanel];
// }
