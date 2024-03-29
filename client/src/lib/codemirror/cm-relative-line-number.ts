import {
  Extension,
  lineNumbers,
} from "@uiw/react-codemirror";

function formatNumber() {
  return lineNumbers({
    formatNumber: (lineNo, state) => {
      if (lineNo > state.doc.lines) {
        return "0";
      }
      const cursorLine = state.doc.lineAt(
        state.selection.asSingle().ranges[0].to,
      ).number;
      if (lineNo === cursorLine) {
        return cursorLine.toString() + " - ";
      } else {
        return Math.abs(cursorLine - lineNo).toString();
      }
    },
  });
}

export const lineNumbersRelative: Extension = [formatNumber()];
