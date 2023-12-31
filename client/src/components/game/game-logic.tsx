import { decorationField } from "@/lib/codemirror/cm-decoration";
import { GameAction } from "@/lib/vim-game";
import { ViewUpdate } from "@uiw/react-codemirror";
import equal from "fast-deep-equal";

export function shouldProceed(
  viewUpdate: ViewUpdate,
  action: GameAction,
  safeCode: string,
): boolean {
  const field = viewUpdate.state.field(decorationField);
  switch (action.action) {
    case "select": {
      if (!viewUpdate.selectionSet) return false;

      if (viewUpdate.docChanged) return false;

      if (viewUpdate.state.doc.toString() !== safeCode) return false;

      let { anchor, head } = viewUpdate.state.selection.main;
      head = head === anchor ? head + 1 : head;

      let selectionTarget = { from: 0, to: 0 };
      field.between(0, viewUpdate.state.doc.length, (from, to) => {
        selectionTarget = { from, to };
      });

      const isEqual = equal({ from: anchor, to: head }, { ...selectionTarget });

      if (
        !isEqual &&
        !equal({ from: head, to: anchor }, { ...selectionTarget })
      ) {
        return false;
      }

      return true;
    }
    case "modify": {
      if (!viewUpdate.docChanged) return false;

      const { after } = action;

      return viewUpdate.state.doc.toString() === after;
    }
    default: {
      return false;
    }
  }
}
