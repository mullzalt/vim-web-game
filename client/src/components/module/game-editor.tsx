import { GameModule, GameStatisticData } from "@/schema/game-module";
import {
  GAME_ACTION,
  game_reducer,
  initialize_game_state,
} from "./game-reducer";
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
  TargetIcon,
} from "lucide-react";
import { formatTime } from "@/lib/format-time";

export function GameEditor(
  props: GameModule & {
    onWinning?: (stats: GameStatisticData) => void;
    onQuit?: () => void;
  },
) {
  const { initial_code, title = "", actions, lang, onQuit, onWinning } = props;

  const initial_state = initialize_game_state({
    initial_code,
    total_progress: actions.length,
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
        doc: initial_code,
        selection: { anchor: 0, head: 0 },
        extensions: extensions,
      }),
    );

    set_statistic(undefined);
    dispatch({ type: GAME_ACTION.RESTART, payload: initial_state });

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
      if (!state.is_playing) {
        if (e.altKey || e.shiftKey || e.ctrlKey || e.key === "Escape") return;
        dispatch({ type: GAME_ACTION.START });
        dispatch({ type: GAME_ACTION.ADD_KEYSTROKE });
        return;
      }

      dispatch({ type: GAME_ACTION.ADD_KEYSTROKE });
    },
    [state.is_playing],
  );

  const handleUpdate = useCallback(
    (vu: ViewUpdate) => {
      if (!vu.selectionSet && !vu.docChanged && !vu.viewportChanged) return;

      if (!state.is_playing) return;

      if (vu.docChanged)
        updateView(
          vu.view,
          actions[state.current_progress],
          state.current_safe_code,
        );

      if (
        is_action_valid(
          vu,
          actions[state.current_progress],
          state.current_safe_code,
        )
      ) {
        dispatch({
          type: GAME_ACTION.NEXT,
          payload: {
            intended_keystrokes:
              actions[state.current_progress].intended_keystrokes,
          },
        });
        dispatch({
          type: GAME_ACTION.SET_CURRENT_SAFE_CODE,
          payload: { current_safe_code: vu.view.state.doc.toString() },
        });
      }
    },
    [state.is_playing, state.current_progress, state.current_safe_code],
  );

  useEffect(() => {
    if (!state.is_playing) return;

    const intervalId = setInterval(
      () => dispatch({ type: GAME_ACTION.ADD_TIME }),
      10,
    );

    return () => clearInterval(intervalId);
  }, [state.is_playing]);

  useEffect(() => {
    if (actions.length < 1) return;
    if (!view) return;

    if (state.is_winning) {
      view.dispatch({
        effects: [filterDecoration.of(() => false), filterTooltip.of(null)],
      });
      statistic_ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });

      return;
    }

    const action = actions[state.current_progress];

    if (action.hints) {
      set_current_hint(action.hints);
    } else {
      set_current_hint(undefined);
    }

    updateView(view, action, state.current_safe_code);
    return () => {};
  }, [
    view,
    state.is_playing,
    state.is_winning,
    state.current_progress,
    state.current_safe_code,
  ]);

  useEffect(() => {
    if (!state.is_winning) return;

    const total_keystrokes_score = state.keystroke_scores.reduce(
      (a, b) => a + b,
      0,
    );
    const total_times_score = state.time_scores.reduce((a, b) => a + b, 0);
    const stats: GameStatisticData = {
      times: state.times,
      time_total: state.times.reduce((a, b) => a + b, 0),
      time_scores: state.time_scores,
      time_scores_total: total_times_score,
      keystrokes: state.keystrokes,
      keystroke_total: state.keystrokes.reduce((a, b) => a + b, 0),
      keystroke_scores: state.keystroke_scores,
      keystroke_scores_total: total_keystrokes_score,
      total_score: total_keystrokes_score + total_times_score,
      grade_time: Math.floor(total_times_score / state.total_progress),
      grade_keystroke: Math.floor(
        total_keystrokes_score / state.total_progress,
      ),
      grade_overall: Math.floor(
        (total_keystrokes_score + total_times_score) / 2 / state.total_progress,
      ),
    };
    set_statistic(stats);

    onWinning && onWinning(stats);

    return () => {};
  }, [state.is_winning]);

  //update feedback
  useEffect(() => {
    if (!view) return;
    if (state.keystroke_scores.length < 1) return;

    view.dispatch({
      effects: [
        addFeedback.of({
          pos: view.state.selection.main.anchor,
          score:
            state.keystroke_scores[state.keystroke_scores.length - 1] +
            state.time_scores[state.time_scores.length - 1],
        }),
      ],
    });

    const delay = setTimeout(() => {
      view.dispatch({
        effects: filterFeedback.of(null),
      });
    }, 800);

    return () => clearTimeout(delay);
  }, [state.keystroke_scores, state.time_scores]);

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
          {current_hint && (
            <div className="p-4 flex items-center gap-2 text-sm font-semibold border border-accent bg-accent/40 rounded-md">
              <LightbulbIcon />
              {current_hint}
            </div>
          )}
          <div className="p-4 gap-2 min-w-28 flex items-center border-border border-2 rounded-lg">
            <Clock3Icon />
            {formatTime(
              state.times.reduce((a, b) => a + b, 0) + state.current_time,
            )}
          </div>
          <div className="p-4 gap-2 min-w-28 flex items-center border-border border-2 rounded-lg">
            <KeyboardIcon />
            {state.keystrokes.reduce((a, b) => a + b, 0) +
              state.current_keystroke}
          </div>
          <div className="p-4 gap-2 min-w-28 flex items-center border-border border-2 rounded-lg">
            <TargetIcon /> {state.current_progress}/{state.total_progress}
          </div>
        </div>
      </div>
      <VimEditor
        ref={editor_ref}
        value={initial_code}
        className="text-lg"
        height="60vh"
        lang={lang as LanguageName}
        onCreateEditor={handleCreateEditor}
        onMouseDownCapture={handleClick}
        extensions={[decorationField, tooltipExtension, feedbackField]}
        onRestart={handleRestart}
        onUpdate={handleUpdate}
        onKeyDownCapture={handleKeydown}
      />
      {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
      {state.is_winning && (
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
