import { GameModule, GameStatisticData } from "@/schema/game-module";
import { GAME_ACTION, game_reducer, initializeGameState } from "./game-reducer";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { VimEditor, VimEditorRef } from "../game/editor-base";
import {
  decorationField,
  filterDecoration,
} from "@/lib/codemirror/cm-decoration";
import { filterTooltip, tooltipExtension } from "@/lib/codemirror/cm-tooltip";
import {
  addFeedback,
  feedbackField,
  filterFeedback,
} from "@/lib/codemirror/cm-feedback";
import {
  EditorState,
  EditorView,
  Extension,
  ViewUpdate,
} from "@uiw/react-codemirror";
import { LanguageName } from "@uiw/codemirror-extensions-langs";
import { Button } from "../ui/button";
import { updateView } from "@/lib/game/cm-update-view";
import { is_action_valid } from "./game-action-checker";
import { GameStatisticChart } from "./game-statistic-chart";
import {
  ChevronLeftIcon,
  Clock3Icon,
  KeyboardIcon,
  LightbulbIcon,
  Repeat2Icon,
  SparkleIcon,
  TargetIcon,
} from "lucide-react";
import { formatTime } from "@/lib/format-time";

export function GameEditor(
  props: GameModule & {
    onWinning?: (stats: GameStatisticData) => void;
    onQuit?: () => void;
    children?: React.ReactNode;
    onStart?: () => void;
    onRestart?: () => void;
  },
) {
  const {
    initialCode,
    title = "",
    actions,
    lang,
    intendedKeystrokes,
    onQuit,
    onWinning,
    onStart,
    onRestart,
    children,
  } = props;

  const initial_state = initializeGameState({
    initialCode,
    totalProgress: actions.length,
  });

  const editor_ref = useRef<VimEditorRef>(null);
  const statistic_ref = useRef<HTMLDivElement>(null);

  const [view, set_view] = useState<EditorView>();
  const [extensions, set_extensions] = useState<Extension[]>();
  const [statistic, set_statistic] = useState<GameStatisticData>();
  const [current_hint, set_current_hint] = useState<string>();

  const handleCreateEditor = useCallback(
    (v: EditorView, _: EditorState, e: Extension[]) => {
      set_view(v);
      set_extensions(e);
    },
    [],
  );

  const [state, dispatch] = useReducer(game_reducer, initial_state);

  const handleRestart = useCallback(() => {
    if (!view) return;
    if (!extensions) return;
    if (!editor_ref.current) return;
    view.focus();
    editor_ref.current.editor?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });

    view.setState(
      EditorState.create({
        doc: initialCode,
        selection: { anchor: 0, head: 0 },
        extensions: extensions,
      }),
    );

    set_statistic(undefined);
    dispatch({ type: GAME_ACTION.RESTART, payload: initial_state });

    onRestart && onRestart();

    view.focus();
  }, [view, extensions]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!editor_ref.current) return;
      e.preventDefault();
      if (!editor_ref.current.view?.hasFocus) {
        editor_ref.current.view?.focus();
      }
    },
    [],
  );

  const handleQuit = useCallback(() => {
    onQuit && onQuit();
  }, []);

  const handleKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (actions.length < 1) return;
      if (!state.isPlaying) {
        if (e.altKey || e.shiftKey || e.ctrlKey || e.key === "Escape") return;
        dispatch({ type: GAME_ACTION.START });
        dispatch({ type: GAME_ACTION.ADD_KEYSTROKE });
        onStart && onStart();
        return;
      }

      dispatch({ type: GAME_ACTION.ADD_KEYSTROKE });
    },
    [state.isPlaying],
  );

  const handleUpdate = useCallback(
    (vu: ViewUpdate) => {
      if (!vu.selectionSet && !vu.docChanged && !vu.viewportChanged) return;

      if (!state.isPlaying) return;

      if (vu.docChanged)
        updateView(
          vu.view,
          actions[state.currentProgress],
          state.currentSafeCode,
        );

      if (
        is_action_valid(
          vu,
          actions[state.currentProgress],
          state.currentSafeCode,
        )
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

  useEffect(() => {
    if (!state.isPlaying) return;

    const intervalId = setInterval(
      () => dispatch({ type: GAME_ACTION.ADD_TIME }),
      10,
    );

    return () => clearInterval(intervalId);
  }, [state.isPlaying]);

  useEffect(() => {
    if (actions.length < 1) return;
    if (!view) return;

    if (state.isWinning) {
      view.dispatch({
        effects: [filterDecoration.of(() => false), filterTooltip.of(null)],
      });
      statistic_ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }

    const action = actions[state.currentProgress];

    if (action.hints) {
      set_current_hint(action.hints);
    } else {
      set_current_hint(undefined);
    }

    updateView(view, action, state.currentSafeCode);
    return () => {};
  }, [
    view,
    state.isPlaying,
    state.isWinning,
    state.currentProgress,
    state.currentSafeCode,
  ]);

  useEffect(() => {
    if (!state.isWinning) return;

    const keystrokeTotal = state.keystrokes.reduce((a, b) => a + b, 0);
    const timeTotal = state.times.reduce((a, b) => a + b, 0);
    const totalKeystrokeScore = state.keystrokeScores.reduce(
      (a, b) => a + b,
      0,
    );
    const totalTimeScore = state.timeScores.reduce((a, b) => a + b, 0);
    const OPTIMUM_TIME = intendedKeystrokes * 20;

    const gradeTime = Math.floor((OPTIMUM_TIME / timeTotal) * 100);
    const gradeKeystroke = Math.floor(
      (intendedKeystrokes / keystrokeTotal) * 100,
    );

    const stats: GameStatisticData = {
      times: state.times,
      timeTotal,
      timeScores: state.timeScores,
      timeScoreTotal: totalTimeScore,
      keystrokes: state.keystrokes,
      keystrokeTotal,
      keystrokeScores: state.keystrokeScores,
      keystrokeScoreTotal: totalKeystrokeScore,
      totalScore: totalKeystrokeScore + totalTimeScore,
      gradeTime,
      gradeKeystroke,
      gradeOverall: Math.floor((gradeTime + gradeKeystroke) / 2),
    };
    set_statistic(stats);

    onWinning && onWinning(stats);

    return () => {};
  }, [state.isWinning]);

  //update feedback
  useEffect(() => {
    if (!view) return;
    if (state.keystrokeScores.length < 1) return;

    view.dispatch({
      effects: [
        addFeedback.of({
          pos: view.state.selection.main.anchor,
          score:
            state.keystrokeScores[state.keystrokeScores.length - 1] +
            state.timeScores[state.timeScores.length - 1],
        }),
      ],
    });

    const delay = setTimeout(() => {
      view.dispatch({
        effects: filterFeedback.of(null),
      });
    }, 800);

    return () => clearTimeout(delay);
  }, [state.keystrokeScores, state.timeScores]);

  return (
    <div className="grid gap-8">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="rounded-full"
            onClick={handleQuit}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="font-semibold text-lg">{title}</span>
        </div>
        <div className="flex items-center justify-end gap-4">
          <div className="p-4 gap-2 min-w-28 flex items-center border-border border-2 rounded-lg">
            <SparkleIcon />
            {state.timeScores.reduce((a, b) => a + b, 0) +
              state.keystrokeScores.reduce((a, b) => a + b, 0)}
          </div>
          <div className="p-4 gap-2 min-w-28 flex items-center border-border border-2 rounded-lg">
            <Clock3Icon />
            {formatTime(
              state.times.reduce((a, b) => a + b, 0) + state.currentTime,
            )}
          </div>
          <div className="p-4 gap-2 min-w-28 flex items-center border-border border-2 rounded-lg">
            <KeyboardIcon />
            {state.keystrokes.reduce((a, b) => a + b, 0) +
              state.currentKeystroke}
          </div>
          <div className="p-4 gap-2 min-w-28 flex items-center border-border border-2 rounded-lg">
            <TargetIcon /> {state.currentProgress}/{state.totalProgress}
          </div>
        </div>
      </div>

      {current_hint && (
        <div className="p-4 flex items-center gap-2 text-sm font-semibold border border-accent bg-accent/40 rounded-md">
          <LightbulbIcon />
          {current_hint}
        </div>
      )}
      <VimEditor
        ref={editor_ref}
        value={initialCode}
        autoFocus
        className="text-lg"
        height="60vh"
        lang={lang as LanguageName}
        onCreateEditor={handleCreateEditor}
        onMouseDownCapture={handleClick}
        extensions={[decorationField, tooltipExtension, feedbackField]}
        onRestart={handleRestart}
        onUpdate={handleUpdate}
        onQuit={handleQuit}
        onKeyDownCapture={handleKeydown}
      />
      {children}
      {state.isWinning && (
        <GameStatisticChart ref={statistic_ref} {...statistic} />
      )}
      <div className="flex justify-end items-center gap-4">
        <div className="text-muted font-semibold">
          or enter command :Re to Restart and :q to Quit on editor.
        </div>
        <Button variant={"outline"} className="gap-2" onClick={handleRestart}>
          <Repeat2Icon />
          Restart
        </Button>
      </div>
    </div>
  );
}
