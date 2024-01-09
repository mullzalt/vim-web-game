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
  addDecoration,
  decorationField,
  filterDecoration,
} from "@/lib/codemirror/cm-decoration";
import { filterTooltip, tooltipExtension } from "@/lib/codemirror/cm-tooltip";
import { Decoration, ViewUpdate } from "@uiw/react-codemirror";
import { Label } from "../ui/label";
import { TooltipMain } from "../tooltip-main";
import { Input } from "../ui/input";
import { LanguageName } from "@uiw/codemirror-extensions-langs";
import { Textarea } from "../ui/textarea";

interface ModuleActionMakerProps extends GameModule {
  onSave?: (actions: GameAction[]) => void;
}

export function ModuleActionMaker(props: ModuleActionMakerProps) {
  const { initialCode, actions, lang, onSave } = props;
  const [currentSelection, setCurrentSelection] = useState<{
    anchor: number;
    head: number;
  }>({ anchor: 0, head: 0 });
  const [error, setError] = useState<string>();
  const [currentAction, setCurrentAction] = useState<GameAction>();
  const [state, dispatch] = useReducer(
    moduleReducer,
    initializeModuleState({ initialCode, actions }),
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
      if (!currentAction) return;

      dispatch({
        type: GAME_MODULE_ACTION.UPDATE_CURRENT_ACTION,
        payload: {
          module_action: {
            ...currentAction,
            intendedKeystrokes: Math.max(Number(e.target.value), 1),
          },
        },
      });
    },
    [currentAction, state.currentIndex],
  );
  const handleHintChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      if (!currentAction) return;

      dispatch({
        type: GAME_MODULE_ACTION.UPDATE_CURRENT_ACTION,
        payload: {
          module_action: {
            ...currentAction,
            hints: e.target.value.length > 0 ? e.target.value : undefined,
          },
        },
      });
    },
    [state.currentIndex, currentAction],
  );

  const handleActionUpdate = useCallback(
    (vu: ViewUpdate) => {
      if (!vu.selectionSet && !vu.docChanged && !vu.viewportChanged) return;
      if (!currentAction) return;

      if (vu.selectionSet) {
        const { anchor, head } = vu.state.selection.main;
        setCurrentSelection({ anchor, head });
      }

      if (
        currentAction.action === "select" &&
        vu.state.doc.toString() === state.currentCodeAfter
      ) {
        setError(undefined);
        vu.view.dispatch({
          effects: [filterDecoration.of(() => false), filterTooltip.of(null)],
        });
      }

      if (
        currentAction.action === "select" &&
        vu.state.doc.toString() !== state.currentCodeAfter
      ) {
        updateView(vu.view, currentAction, state.currentCodeAfter);
        setError("Please do not change the code in selection mode!");
      }

      if (
        currentAction.action === "modify" &&
        state.currentCodeAfter === state.currentCodeBefore
      ) {
        setError(
          "please add a change on modify, otherwise the game will not proceed",
        );
      }
      if (
        currentAction.action === "modify" &&
        state.currentCodeAfter !== state.currentCodeBefore
      ) {
        setError(undefined);
      }

      if (currentAction.action === "modify" && vu.docChanged) {
        dispatch({
          type: GAME_MODULE_ACTION.UPDATE_CURRENT_ACTION,
          payload: {
            module_action: {
              ...currentAction,
              after: vu.view.state.doc.toString(),
            },
          },
        });
      }
    },
    [currentAction, state.currentCodeBefore, state.currentCodeAfter],
  );

  const handleUpdateSelection = useCallback(() => {
    if (!currentAction) return;
    if (currentAction.action !== "select") return;
    dispatch({
      type: GAME_MODULE_ACTION.UPDATE_CURRENT_ACTION,
      payload: {
        module_action: { ...currentAction!, selection: currentSelection! },
      },
    });
    editorRef.current?.view?.focus();
  }, [currentSelection, currentAction, state.currentIndex]);

  useEffect(() => {
    onSave && onSave(state.actions);
  }, [state.actions]);

  useEffect(() => {
    if (state.currentIndex < 0 || state.currentIndex >= state.actions.length) {
      setCurrentAction(undefined);
      return;
    }

    setCurrentAction(state.actions[state.currentIndex]);
  }, [state.actions, state.currentIndex, state.currentCodeBefore]);

  useEffect(() => {
    previewRef.current?.view &&
      previewRef.current.view.dispatch({
        changes: {
          from: 0,
          to: previewRef.current.view.state.doc.length,
          insert: state.currentCodeBefore,
        },
      });
  }, [state.currentCodeAfter, state.currentCodeBefore, state.lastCodeAfter]);

  useEffect(() => {
    if (!previewRef.current?.view) return;
    if (state.currentIndex < 0 || state.currentIndex >= state.actions.length)
      return;

    updateView(
      previewRef.current.view,
      state.actions[state.currentIndex],
      state.currentCodeBefore,
    );
  }, [state.actions, state.currentIndex, state.currentCodeBefore]);

  return (
    <Fragment>
      <div className="flex gap-2 w-full p-4">
        <div className="grid grow grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            {currentAction && currentAction.action === "select" ? (
              <Fragment>
                <div className="flex justify-between items-center">
                  <span>
                    Current Selection: ({currentSelection?.anchor},{" "}
                    {currentSelection?.head})
                  </span>
                  <span>
                    <Button variant={"outline"} onClick={handleUpdateSelection}>
                      Mark current selection
                    </Button>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>
                    Action Selection: ({currentAction.selection?.anchor},{" "}
                    {currentAction.selection?.head})
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
            {currentAction && (
              <Fragment>
                <div className="grid grid-cols-2 items-center justify-end">
                  <Label>Hints</Label>
                  <Textarea
                    value={currentAction?.hints || ""}
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
                    value={currentAction.intendedKeystrokes}
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
            value={state.currentCodeAfter || initialCode}
            lang={lang as LanguageName}
          />
          <VimEditor
            ref={previewRef}
            editable={false}
            extensions={[decorationField, tooltipExtension]}
            readOnly
            height="40vh"
            className="text-base opacity-80"
            value={initialCode}
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
                    i !== state.currentIndex &&
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
