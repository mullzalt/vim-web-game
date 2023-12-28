import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  EditorView,
  EditorState,
  Extension,
  keymap,
} from "@uiw/react-codemirror";
import equal from "fast-deep-equal";
import { UseEditor, useEditor } from "./use-editor";
import {
  LanguageName,
  langs,
  loadLanguage,
} from "@uiw/codemirror-extensions-langs";
import { Vim } from "@replit/codemirror-vim";

import { cn } from "@/lib/utils";
import { vimMode } from "@/lib/codemirror/cm-vim";
import { lineNumbersRelative } from "@/lib/codemirror/cm-relative-line-number";

interface VimEditorProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "onChange" | "placeholder"
    >,
    Omit<UseEditor, "container"> {
  lang?: LanguageName | null;
  onQuit?: () => void;
  onWrite?: (state: EditorState, extensions: Extension[]) => void;
  onRestart?: (state: EditorState, extensions: Extension[]) => void;
}

export interface VimEditorRef {
  editor?: HTMLDivElement | null;
  state?: EditorState;
  view?: EditorView;
}

const ReactVimEditor = forwardRef<VimEditorRef, VimEditorProps>(
  (props, ref) => {
    const {
      lang,
      className,
      value = "",
      selection,
      extensions = [],
      onCreateEditor,
      onUpdate,
      autoFocus,
      theme = "dark",
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
      placeholder,
      indentWithTab,
      editable,
      readOnly,
      root,
      onQuit,
      onWrite,
      onRestart,
      ...other
    } = props;

    const editor = useRef<HTMLDivElement>(null);

    const language: Extension = lang ? [loadLanguage(lang) as Extension] : [];

    const {
      state,
      view,
      container,
      extensions: defaultExtensions,
    } = useEditor({
      container: editor.current,
      root,
      value,
      autoFocus,
      theme,
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
      placeholder,
      indentWithTab,
      editable,
      readOnly,
      selection,
      onCreateEditor,
      onUpdate,
      extensions: [
        vimMode,
        lineNumbersRelative,
        language,
        keymap.of([
          { key: "Ctrl-a", preventDefault: true },
          { key: "Ctrl-s", preventDefault: true },
          { key: "Mod-z", run: () => false, preventDefault: true },
          {
            key: "Mod-y",
            mac: "Mod-Shift-z",
            run: () => false,
            preventDefault: true,
          },
          { linux: "Ctrl-Shift-z", run: () => false, preventDefault: true },
          {
            key: "Alt-u",
            mac: "Mod-Shift-u",
            run: () => false,
            preventDefault: true,
          },
        ]),
        ...extensions,
      ],
    });

    Vim.defineEx("quit", "q", () => {
      onQuit && onQuit();
    });

    Vim.defineEx("write", "w", () => {
      if (!state) return;
      onWrite && onWrite(state, defaultExtensions);
    });

    Vim.defineEx("Restart", "Re", () => {
      if (!state) return;
      onRestart && onRestart(state, defaultExtensions);
    });

    useImperativeHandle(
      ref,
      () => ({ editor: editor.current, state: state, view: view }),
      [editor, container, state, view],
    );

    // check type of value
    if (typeof value !== "string") {
      throw new Error(`value must be typeof string but got ${typeof value}`);
    }

    // useEffect(() => console.count("component render"));

    const defaultClassNames =
      typeof theme === "string" ? `cm-theme-${theme}` : "cm-theme";
    return (
      <div
        ref={editor}
        className={cn(defaultClassNames, className)}
        {...other}
      />
    );
  },
);

const VimEditor = memo(ReactVimEditor, (prev, next) => {
  return equal(prev, next);
});

export { VimEditor };
