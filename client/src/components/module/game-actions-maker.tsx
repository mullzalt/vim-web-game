import { GameAction, GameModule } from "@/schema/game-module";
import {
  Fragment,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  GAME_MODULE_ACTION,
  initializeModuleState,
  moduleReducer,
} from "./game-actions-reducer";
import { VimEditor, VimEditorRef } from "../game/editor-base";
import { Button } from "../ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateView } from "@/lib/game/cm-update-view";
import {
  decorationField,
  filterDecoration,
} from "@/lib/codemirror/cm-decoration";
import { filterTooltip, tooltipExtension } from "@/lib/codemirror/cm-tooltip";
import { ViewUpdate } from "@uiw/react-codemirror";
import { Label } from "../ui/label";
import { TooltipMain } from "../tooltip-main";
import { Input } from "../ui/input";
import { LanguageName } from "@uiw/codemirror-extensions-langs";

interface ModuleActionMakerProps extends GameModule {
  onSave?: (actions: GameAction[]) => void;
}

export function ModuleActionMaker(props: ModuleActionMakerProps) {
  const { initial_code, actions, lang, onSave } = props;
  const [current_selection, set_current_selection] = useState<{
    anchor: number;
    head: number;
  }>();
  const [error, set_error] = useState<string>();
  const [current_action, set_current_action] = useState<GameAction>();
  const [state, dispatch] = useReducer(
    moduleReducer,
    initializeModuleState({ initial_code, actions }),
  );

  const editorRef = useRef<VimEditorRef>(null);
  const previewRef = useRef<VimEditorRef>(null);

  const handleAddNewSelection = useCallback(() => {
    dispatch({ type: GAME_MODULE_ACTION.ADD_EMPTY_SELECT });
  }, [state.actions]);

  const handleAddNewModify = useCallback(() => {
    dispatch({ type: GAME_MODULE_ACTION.ADD_EMPTY_MODIFY });
  }, [state.actions]);

  const handleSelectAction = useCallback(
    (index: number) =>
      dispatch({
        type: GAME_MODULE_ACTION.SET_CURRENT_ACTION,
        payload: { index },
      }),
    [],
  );

  const handleRemoveAction = useCallback(
    (index: number) =>
      dispatch({
        type: GAME_MODULE_ACTION.REMOVE_CURRENT_INDEX,
        payload: { index },
      }),
    [],
  );
  const handleIntendedKeystrokeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (!current_action) return;

      dispatch({
        type: GAME_MODULE_ACTION.UPDATE_CURRENT_ACTION,
        payload: {
          module_action: {
            ...current_action,
            intended_keystrokes: Math.max(Number(e.target.value), 1),
          },
        },
      });
    },
    [current_action, state.current_index],
  );
  const handleHintChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (!current_action) return;

      dispatch({
        type: GAME_MODULE_ACTION.UPDATE_CURRENT_ACTION,
        payload: {
          module_action: {
            ...current_action,
            hints: e.target.value.length > 0 ? e.target.value : undefined,
          },
        },
      });
    },
    [state.current_index, current_action],
  );

  const handleActionUpdate = useCallback(
    (vu: ViewUpdate) => {
      if (!vu.selectionSet && !vu.docChanged && !vu.viewportChanged) return;
      if (!current_action) return;

      if (vu.selectionSet) {
        const { anchor, head } = vu.state.selection.main;
        set_current_selection({ anchor, head });
      }

      if (
        current_action.action === "select" &&
        vu.state.doc.toString() === state.current_code_after
      ) {
        set_error(undefined);
        vu.view.dispatch({
          effects: [filterDecoration.of(() => false), filterTooltip.of(null)],
        });
      }

      if (
        current_action.action === "select" &&
        vu.state.doc.toString() !== state.current_code_after
      ) {
        updateView(vu.view, current_action, state.current_code_after);
        set_error("Please do not change the code in selection mode!");
      }

      if (
        current_action.action === "modify" &&
        state.current_code_after === state.current_code_before
      ) {
        set_error(
          "please add a change on modify, otherwise the game will not proceed",
        );
      }
      if (
        current_action.action === "modify" &&
        state.current_code_after !== state.current_code_before
      ) {
        set_error(undefined);
      }

      if (current_action.action === "modify" && vu.docChanged) {
        dispatch({
          type: GAME_MODULE_ACTION.UPDATE_CURRENT_ACTION,
          payload: {
            module_action: {
              ...current_action,
              after: vu.view.state.doc.toString(),
            },
          },
        });
      }
    },
    [current_action, state.current_code_before, state.current_code_after],
  );

  const handleUpdateSelection = useCallback(() => {
    if (!current_action) return;
    if (current_action.action !== "select") return;
    dispatch({
      type: GAME_MODULE_ACTION.UPDATE_CURRENT_ACTION,
      payload: {
        module_action: { ...current_action!, selection: current_selection! },
      },
    });
    editorRef.current?.view?.focus();
  }, [current_selection, current_action, state.current_index]);

  useEffect(() => {
    onSave && onSave(state.actions);
  }, [state.actions]);

  useEffect(() => {
    if (
      state.current_index < 0 ||
      state.current_index >= state.actions.length
    ) {
      set_current_action(undefined);
      return;
    }

    set_current_action(state.actions[state.current_index]);
  }, [state.actions, state.current_index, state.current_code_before]);

  useEffect(() => {
    previewRef.current?.view &&
      previewRef.current.view.dispatch({
        changes: {
          from: 0,
          to: previewRef.current.view.state.doc.length,
          insert: state.current_code_before,
        },
      });
  }, [
    state.current_code_after,
    state.current_code_before,
    state.last_code_after,
  ]);

  useEffect(() => {
    if (!previewRef.current?.view) return;
    if (state.current_index < 0 || state.current_index >= state.actions.length)
      return;

    updateView(
      previewRef.current.view,
      state.actions[state.current_index],
      state.current_code_before,
    );
  }, [state.actions, state.current_index, state.current_code_before]);

  return (
    <Fragment>
      <div className="flex gap-2 w-full p-4">
        <div className="grid grow grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            {current_action && current_action.action === "select" ? (
              <Fragment>
                <div className="flex justify-between items-center">
                  <span>
                    Current Selection: ({current_selection?.anchor},{" "}
                    {current_selection?.head})
                  </span>
                  <span>
                    <Button variant={"outline"} onClick={handleUpdateSelection}>
                      Mark current selection
                    </Button>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>
                    Action Selection: ({current_action.selection?.anchor},{" "}
                    {current_action.selection?.head})
                  </span>
                </div>
              </Fragment>
            ) : (
              ""
            )}
            {error && (
              <div className="p-2 font-bold bg-destructive text-destructive-foreground mt-auto text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {current_action && (
              <Fragment>
                <div className="grid grid-cols-2 items-center justify-end">
                  <Label>Hints</Label>
                  <Input
                    type="text"
                    value={current_action?.hints || ""}
                    onChange={handleHintChange}
                  />
                </div>
                <div className="grid mt-auto grid-cols-2 items-center">
                  <TooltipMain tooltip="the optimal keystrokes used to complete the action">
                    <Label>Intended keystrokes</Label>
                  </TooltipMain>
                  <Input
                    type="number"
                    min={1}
                    value={current_action.intended_keystrokes}
                    onChange={handleIntendedKeystrokeChange}
                  />
                </div>
              </Fragment>
            )}
          </div>
          <VimEditor
            ref={editorRef}
            height="40vh"
            className="text-base"
            extensions={[decorationField, tooltipExtension]}
            onUpdate={handleActionUpdate}
            value={state.current_code_after || initial_code}
            lang={lang as LanguageName}
          />
          <VimEditor
            ref={previewRef}
            editable={false}
            extensions={[decorationField, tooltipExtension]}
            readOnly
            height="40vh"
            className="text-base opacity-80"
            value={initial_code}
            lang={lang as LanguageName}
          />
        </div>

        <div className="flex flex-col gap-2 p-2 items-center h-[70vh] overflow-y-scroll">
          <div className="grid grid-cols-4 gap-2">
            <Button
              className="col-span-2"
              variant={"ghost"}
              onClick={handleAddNewSelection}
              disabled={Boolean(error)}
            >
              <PlusIcon className="mr-2 w-4 h-4" /> Selection
            </Button>
            <Button
              className="col-span-2"
              variant={"ghost"}
              onClick={handleAddNewModify}
              disabled={Boolean(error)}
            >
              <PlusIcon className="mr-2 w-4 h-4" /> Modify
            </Button>
          </div>
          {state.actions.map((action, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <Button
                  variant={action.action === "select" ? "default" : "secondary"}
                  className={cn(
                    "w-full border",
                    action.action === "select"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-accent text-accent-foreground border-accent",
                    i !== state.current_index &&
                      "text-foreground bg-transparent",
                  )}
                  onClick={() => handleSelectAction(i)}
                  disabled={Boolean(error)}
                >
                  action-{i + 1}
                </Button>
              </div>
              <div className="col-span-1">
                <Button
                  variant={"outline"}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleRemoveAction(i)}
                  disabled={Boolean(error)}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}
