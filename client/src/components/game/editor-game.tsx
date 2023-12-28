import { decorationField } from "@/lib/codemirror/cm-decoration";
import { VimEditor, VimEditorRef } from "./editor-base";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { GameModule } from "@/lib/vim-game";
import { GAME_ACTION, gameReducer, initialGameState } from "./game-reducer";
import {
  EditorState,
  EditorView,
  Extension,
  ViewUpdate,
} from "@uiw/react-codemirror";

export function VimGame(props: Partial<GameModule>) {
  const {
    initialCode = "",
    actions = [],
    title = "",
    desc = "",
    hints = "",
    lang = null,
  } = props;
  const editor = useRef<VimEditorRef>(null);

  // const initialState = initialGameState(initialCode, actions.length);
  const initialState = initialGameState("test", 10);

  const [state, dispatch] = useReducer(gameReducer, initialState);

  const handleUpdate = useCallback(
    (vu: ViewUpdate) => {
      if (!vu.selectionSet && !vu.docChanged && !vu.viewportChanged) return;

      if (!state.isPlaying) return;

      if (vu.view.state.doc.toString() === "next") {
        dispatch({ type: GAME_ACTION.NEXT });
      }
    },
    [state.isPlaying],
  );

  const handleRestart = useCallback(
    (_: EditorState, extensions: Extension[]) => {
      if (!editor.current?.view) return;
      const { view } = editor.current;

      view.setState(
        EditorState.create({
          doc: initialCode,
          selection: { anchor: 0, head: 0 },
          extensions,
        }),
      );

      dispatch({ type: GAME_ACTION.RESTART, payload: initialState });

      view.focus();
    },
    [],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!editor.current) return;
      e.preventDefault();
      if (!editor.current.view?.hasFocus) {
        editor.current.view?.focus();
      }
    },
    [],
  );

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!state.isPlaying) {
        if (e.altKey || e.shiftKey || e.ctrlKey || e.key === "Escape") return;
        dispatch({ type: GAME_ACTION.START });
        dispatch({ type: GAME_ACTION.ADD_KEYSTROKE });
        return;
      }

      if (!state.isPlaying) return;

      dispatch({ type: GAME_ACTION.ADD_KEYSTROKE });
    },
    [state.isPlaying],
  );

  useEffect(() => {
    if (!state.isPlaying) return;

    const intervalId = setInterval(
      () => dispatch({ type: GAME_ACTION.ADD_TIME }),
      10,
    );

    return () => clearInterval(intervalId);
  }, [state.isPlaying]);

  return (
    <div>
      <VimEditor
        ref={editor}
        className="text-lg"
        height="60vh"
        autoFocus
        extensions={[decorationField]}
        onMouseDownCapture={handleClick}
        onKeyDownCapture={handleKeydown}
        onUpdate={handleUpdate}
        onRestart={handleRestart}
        // onQuit={() => {}}
        lang={lang}
        value={initialCode}
      />
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}
