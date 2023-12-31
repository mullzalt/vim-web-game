import {
  decorationField,
  filterDecoration,
} from "@/lib/codemirror/cm-decoration";
import { VimEditor, VimEditorRef } from "./editor-base";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { GameModule, GameStatisticData } from "@/lib/vim-game";
import { GAME_ACTION, gameReducer, initialGameState } from "./game-reducer";
import { EditorState, EditorView, ViewUpdate } from "@uiw/react-codemirror";
import * as themes from "@uiw/codemirror-themes-all";
import { filterTooltip, tooltipExtension } from "@/lib/codemirror/cm-tooltip";
import { updateView } from "./game-highlight";
import { shouldProceed } from "./game-logic";
import { GameStatistic } from "./game-statistic";
import { Button } from "../ui/button";
import {
  addFeedback,
  feedbackField,
  filterFeedback,
} from "@/lib/codemirror/cm-feedback";
import {
  Clock3Icon,
  KeyboardIcon,
  Repeat2Icon,
  TargetIcon,
} from "lucide-react";
import { formatTime } from "@/lib/format-time";

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
  const statisticRef = useRef<HTMLDivElement>(null);

  const initialState = initialGameState(initialCode, actions.length);

  const [view, setView] = useState<EditorView>();

  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [statistic, setStatistic] = useState<GameStatisticData>();
  const [selection, setSelection] = useState<{
    anchor: number;
    head: number;
  }>();

  const handleCreateEditor = useCallback((v: EditorView) => {
    setView(v);
  }, []);

  const handleUpdate = useCallback(
    (vu: ViewUpdate) => {
      if (!vu.selectionSet && !vu.docChanged && !vu.viewportChanged) return;

      const { anchor, head } = vu.view.state.selection.main;
      setSelection({ anchor, head });
      if (!state.isPlaying) return;

      if (vu.docChanged)
        updateView(
          vu.view,
          actions[state.currentProgress],
          state.currentSafeCode,
        );

      if (
        shouldProceed(vu, actions[state.currentProgress], state.currentSafeCode)
      ) {
        dispatch({
          type: GAME_ACTION.NEXT,
          payload: {
            intendedKeystrokes:
              actions[state.currentProgress].intendedKeystrokes,
          },
        });
        dispatch({
          type: GAME_ACTION.SET_CURRENT_SAFE_CODE,
          payload: { currentSafeCode: vu.view.state.doc.toString() },
        });
      }
    },
    [state.isPlaying, state.currentProgress, state.currentSafeCode],
  );

  const handleRestart = useCallback(() => {
    if (!editor.current?.view) return;
    if (!editor.current?.extensions) return;
    const { view, extensions } = editor.current;
    view.focus();
    editor.current.editor?.scrollIntoView({
      behavior: "instant",
      block: "start",
    });

    view.setState(
      EditorState.create({
        doc: initialCode,
        selection: { anchor: 0, head: 0 },
        extensions,
      }),
    );

    setStatistic(undefined);
    dispatch({ type: GAME_ACTION.RESTART, payload: initialState });

    view.focus();
  }, []);

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
    if (!view) return;
    if (state.isWinning) {
      view.dispatch({
        effects: [filterDecoration.of(() => false), filterTooltip.of(null)],
      });
      statisticRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });

      return;
    }
    const action = actions[state.currentProgress];
    updateView(view, action, state.currentSafeCode);
  }, [
    view,
    state.currentSafeCode,
    state.currentProgress,
    state.isPlaying,
    state.isWinning,
  ]);

  useEffect(() => {
    if (!state.isWinning) return;

    const totalKsScore = state.ksScore.reduce((a, b) => a + b, 0);
    const totalTimeScore = state.timeScore.reduce((a, b) => a + b, 0);
    setStatistic({
      times: state.times,
      keystrokes: state.keystrokes,
      ksScores: state.ksScore,
      timeScores: state.timeScore,
      totalScore: totalKsScore + totalTimeScore,
      totalKsScore,
      totalTimeScore,
      totalTime: state.times.reduce((a, b) => a + b, 0),
      totalKeystrokes: state.keystrokes.reduce((a, b) => a + b, 0),
      timeGrade: Math.floor(totalTimeScore / state.totalProgress),
      keyStrokeGrade: Math.floor(totalKsScore / state.totalProgress),
      overallGrade: Math.floor(
        (totalTimeScore + totalKsScore) / 2 / state.totalProgress,
      ),
    });
  }, [state.isWinning]);

  useEffect(() => {
    if (!view) return;
    if (state.ksScore.length < 1) return;

    view.dispatch({
      effects: [
        addFeedback.of({
          pos: view.state.selection.main.anchor,
          score:
            state.ksScore[state.ksScore.length - 1] +
            state.timeScore[state.timeScore.length - 1],
        }),
      ],
    });

    const delay = setTimeout(() => {
      view.dispatch({
        effects: filterFeedback.of(null),
      });
    }, 800);

    return () => clearTimeout(delay);
  }, [state.ksScore, state.timeScore]);

  useEffect(() => {
    if (!state.isPlaying) return;

    const intervalId = setInterval(
      () => dispatch({ type: GAME_ACTION.ADD_TIME }),
      10,
    );

    return () => clearInterval(intervalId);
  }, [state.isPlaying]);

  return (
    <div className="grid gap-8">
      <div className="flex justify-end items-center gap-4">
        <div className="p-4 gap-2 min-w-28 flex items-center border-border border-2 rounded-lg">
          <Clock3Icon />
          {formatTime(
            state.times.reduce((a, b) => a + b, 0) + state.currentTime,
          )}
        </div>
        <div className="p-4 gap-2 min-w-28 flex items-center border-border border-2 rounded-lg">
          <KeyboardIcon />
          {state.keystrokes.reduce((a, b) => a + b, 0) +
            state.currentKeystrokes}
        </div>
        <div className="p-4 gap-2 min-w-28 flex items-center border-border border-2 rounded-lg">
          <TargetIcon /> {state.currentProgress}/{state.totalProgress}
        </div>
        <div>{JSON.stringify(selection)}</div>
      </div>
      <VimEditor
        ref={editor}
        className="text-lg"
        height="60vh"
        autoFocus
        theme={themes["gruvboxDark"]}
        extensions={[decorationField, tooltipExtension, feedbackField]}
        onCreateEditor={handleCreateEditor}
        onMouseDownCapture={handleClick}
        onKeyDownCapture={handleKeydown}
        onUpdate={handleUpdate}
        onRestart={handleRestart}
        // onQuit={() => {}}
        lang={lang}
        value={initialCode}
      />

      {/* <pre>{JSON.stringify(statistic, null, 1)}</pre> */}

      {state.isWinning && <GameStatistic ref={statisticRef} {...statistic} />}
      {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
      <div className="flex items-center justify-end">
        <Button size={"lg"} variant={"outline"} onClick={handleRestart}>
          <Repeat2Icon className="mr-2" />
          Restart
        </Button>
      </div>
    </div>
  );
}
