import {
  Decoration,
  DecorationSet,
  EditorView,
  Range,
  StateEffect,
  StateField,
  WidgetType,
} from "@uiw/react-codemirror";

const addDecoration = StateEffect.define<Range<Decoration>[]>();
const filterDecoration =
  StateEffect.define<(from: number, to: number) => boolean>();

const decorationField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(value, tr) {
    value = value.map(tr.changes);
    for (let effects of tr.effects) {
      if (effects.is(addDecoration))
        value = value.update({ add: effects.value, sort: true });
      else if (effects.is(filterDecoration))
        value = value.update({ filter: effects.value });
    }
    return value;
  },
  provide: (f) => EditorView.decorations.from(f),
});

class lineWidget extends WidgetType {
  constructor(readonly text: string) {
    super();
  }

  eq(other: lineWidget) {
    return other.text === this.text;
  }

  toDOM(view: EditorView): HTMLElement {
    let wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className =
      "text-white text-sm border-dashed border-t-2 w-full flex justify-end items-center px-4";

    let indicator = document.createElement("span");
    indicator.textContent = this.text;
    indicator.className =
      "border border-green text-green bg-slate-800 p-0.5 rounded-sm absolute";
    wrap.appendChild(indicator);
    return wrap;
  }

  ignoreEvent(event: Event): boolean {
    return false;
  }
}

export { addDecoration, filterDecoration, decorationField, lineWidget };
