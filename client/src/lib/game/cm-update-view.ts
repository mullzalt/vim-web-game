import { Decoration, EditorView, StateEffect } from "@uiw/react-codemirror";
import { Change, diffArrays, diffChars, diffWordsWithSpace } from "diff";
import {
  addDecoration,
  lineWidget,
  filterDecoration,
} from "@/lib/codemirror/cm-decoration";
import { addTooltip, filterTooltip } from "@/lib/codemirror/cm-tooltip";
import { GameAction } from "@/schema/game-module";

export function updateView(
  view: EditorView,
  action: GameAction,
  safeCode: string,
) {
  const doc = view.state.doc.toString();
  let code = safeCode;
  const effects: StateEffect<any>[] = [];

  if (action.action === "select" && doc === code) {
    const max = doc.length;
    let { head, anchor } = action.selection;
    head = head === anchor ? head + 1 : head;

    if (anchor > head) {
      let temp = head;
      head = anchor;
      anchor = temp;
    }

    effects.push(
      addDecoration.of([
        Decoration.mark({
          class: "border-2 border-yellow-400",
        }).range(Math.min(anchor, max), Math.min(head, max)),
      ]),
    );
  }

  if (action.action === "modify") {
    code = action.after;
  }

  let currentLine = 1;
  diffArrays(doc.split("\n"), code.split("\n")).map((diff) => {
    const { value, added, removed } = diff;

    if (removed) {
      value.map((_, j) => {
        effects.push(
          addDecoration.of([
            Decoration.line({
              class: "bg-red-200/10",
            }).range(view.state.doc.line(currentLine + j).from),
          ]),
        );
      });
    }

    currentLine += added ? 0 : value.length;
  });

  let shouldUseWord = false;

  const diffW = diffWordsWithSpace(doc, code).filter(
    (diff) => diff.added || diff.removed,
  );

  if (diffW.length > 1) {
    const wordDiff = diffW.reduce((a, b) => {
      if (b.removed) return a + b.value.length;
      if (b.added) return a - b.value.length;
      return a;
    }, 0);
    shouldUseWord = Math.abs(wordDiff) > 1;
  }

  let currentFrom = 0;
  function mapDiff(diff: Change) {
    const { value, added, removed } = diff;
    const from = currentFrom;
    const to = from + value.length;
    const posAdd = added ? 0 : value.length;

    const hasNewLine = diff.value.match(/\n.*/);

    if (diff.added && hasNewLine) {
      effects.push(
        addDecoration.of([
          Decoration.widget({
            widget: new lineWidget(diff.value.replace(/\n/, "")),
            block: true,
            side: 1,
          }).range(from),
        ]),
      );
    }

    if (added && !hasNewLine) {
      effects.push(
        addTooltip.of({
          text: diff.value.replace(/\n/g, "↵").replace(/^\s/, "␣"),
          pos: from,
        }),
      );
    }

    if (removed) {
      effects.push(
        addDecoration.of([
          Decoration.mark({
            class: "bg-red-400",
          }).range(from, to),
        ]),
      );
    }

    currentFrom += posAdd;
  }

  if (shouldUseWord) diffWordsWithSpace(doc, code).map(mapDiff);
  else diffChars(doc, code).map(mapDiff);

  view.dispatch({
    effects: [
      filterDecoration.of(() => false),
      filterTooltip.of(null),
      ...effects.reverse(),
    ],
  });
  return;
}
