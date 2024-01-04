import { VimEditor, VimEditorRef } from "@/components/game/editor-base";
import { VimGame } from "@/components/game/editor-game";
import { ModuleActionMaker } from "@/components/module/game-actions-maker";
import { GameEditor } from "@/components/module/game-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkDownReader } from "@/components/ui/markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { decorationField } from "@/lib/codemirror/cm-decoration";
import { tooltipExtension } from "@/lib/codemirror/cm-tooltip";
import { updateView } from "@/lib/game/cm-update-view";
import { GameModule, GameAction } from "@/schema/game-module";
import { EditorView, ViewUpdate } from "@uiw/react-codemirror";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function getCodeFromActions(initial_code: string, actions: GameAction[]) {
  const codes: { before: string; after: string }[] = [];
  let current_code = initial_code;
  actions.map((a) => {
    if (a.action === "select") {
      codes.push({ before: current_code, after: current_code });
      return;
    }

    codes.push({ before: current_code, after: a.after });
    current_code = a.after;
    return;
  });

  return codes;
}

function ActionTester(
  props: GameModule & { onSave?: (actions: GameAction[]) => void },
) {
  const { lang, actions: _actions, initial_code, onSave } = props;

  const [actions, setActions] = useState<GameAction[]>(_actions);
  const [current_action, set_current_action] = useState<GameAction>();
  const [current_code, set_current_code] = useState<string>(initial_code);
  const [current_index, set_current_index] = useState<number>(-1);
  const [current_selection, set_current_selection] = useState<{
    anchor: number;
    head: number;
  }>();
  const [codes, set_codes] = useState<{ before: string; after: string }[]>();

  const editorRef = useRef<VimEditorRef>(null);
  const previewRef = useRef<VimEditorRef>(null);

  const handleAddNewSelection = useCallback(() => {
    setActions((prev) =>
      prev.concat({
        action: "select",
        selection: { anchor: 0, head: 0 },
        intended_keystrokes: 1,
      }),
    );
  }, [current_code, current_action]);

  const handleEditorUpdate = useCallback(
    (vu: ViewUpdate) => {
      if (!vu.selectionSet && !vu.docChanged && !vu.viewportChanged) return;

      if (vu.selectionSet) {
        const { anchor, head } = vu.view.state.selection.main;
        set_current_selection({ anchor, head });
      }

      if (current_action?.action === "modify") {
      }
    },
    [actions, current_index, current_action],
  );

  const handleAddNewModify = useCallback(() => {
    setActions((prev) =>
      prev.concat({
        action: "modify",
        after: current_code,
        intended_keystrokes: 1,
      }),
    );
  }, [current_code, current_action]);

  const handleAddSelectionMark = useCallback(() => {
    if (!current_selection) return;
    if (current_action?.action !== "select") return;

    const update: GameAction = {
      ...current_action,
      selection: current_selection,
    };

    setActions((prev) => [
      ...prev.slice(0, current_index),
      update,
      ...prev.slice(current_index + 1),
    ]);

    if (!previewRef.current?.view) return;
    const { view } = previewRef.current;

    updateView(view, update, current_code);
  }, [current_action, current_code, current_index, current_selection]);

  const handleSave = useCallback(() => {
    if (!onSave) return;
    onSave(actions);
  }, [actions]);

  const handleIntendKeystrokesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const update: GameAction = {
        ...current_action!,
        intended_keystrokes: Number(e.target.value),
      };

      setActions((prev) => [
        ...prev.slice(0, current_index),
        update,
        ...prev.slice(current_index + 1),
      ]);

      set_current_action(update);
    },
    [current_index, current_action],
  );

  const handleChangeIndex = useCallback(
    (index: number) => {
      set_current_index(index);
      set_current_action(actions[index]);
    },
    [actions],
  );

  useEffect(() => {
    if (!current_action) return;
    if (!previewRef.current?.view) return;
    const { view } = previewRef.current;

    updateView(view, current_action, current_code);
  }, [current_index, current_action]);

  return (
    <div className="grid grid-cols-9 gap-4">
      <div className="col-span-8 grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <Label className="text-lg font-semibold">Action Editor</Label>

          {current_action && current_action.action === "select" ? (
            <div className="grid grid-cols-2 items-center">
              <div className="grid gap-2">
                <Label className=" font-semibold">Current selection</Label>
                {current_selection?.anchor},{current_selection?.head}
              </div>
              <Button onClick={handleAddSelectionMark}>
                Mark Current Selection
              </Button>
            </div>
          ) : (
            ""
          )}
          {current_selection && (
            <div className="grid grid-cols-2 items-center">
              <Label className=" font-semibold">
                Intended Keystrokes used:
              </Label>
              <Input
                type="number"
                min={1}
                value={current_action && current_action.intended_keystrokes}
                onChange={handleIntendKeystrokesChange}
              />
            </div>
          )}
        </div>

        <div>
          <Label className="text-lg font-semibold">Action Preview</Label>
          <div className=" font-semibold">
            Current action:{" "}
            {current_action ? current_action.action : "Nothing is selected"}
          </div>

          {current_action && current_action.action === "select" ? (
            <div className="grid  items-center">
              <div className="grid gap-2">
                <Label className=" font-semibold">Target selection</Label>
                {current_action.selection.anchor},
                {current_action.selection.head}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>

        <VimEditor
          ref={editorRef}
          lang={lang}
          className="text-base"
          height="30em"
          // onUpdate={handleInitialCodeChange}
          onUpdate={handleEditorUpdate}
          value={current_code}
        />

        <VimEditor
          ref={previewRef}
          lang={lang}
          editable={false}
          readOnly
          className="text-base"
          height="30em"
          extensions={[decorationField, tooltipExtension]}
          // onUpdate={handleInitialCodeChange}
          value={current_code}
        />
      </div>
      <div className="col-span-1">
        <Label className="text-lg font-semibold">Index</Label>
        <div className="flex flex-col gap-2">
          <Button onClick={handleSave} disabled={!actions}>
            Save Changes
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={"outline"}
              className="text-sm"
              onClick={handleAddNewSelection}
            >
              +Selction
            </Button>
            <Button
              variant={"outline"}
              className="text-sm"
              onClick={handleAddNewModify}
            >
              +Modify
            </Button>
          </div>
          {actions.map((a, i) => (
            <Button
              key={i}
              variant={i === current_index ? "default" : "outline"}
              onClick={() => handleChangeIndex(i)}
            >
              {i} ({a.action})
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SandboxPage() {
  const [gameModule, setGameModule] = useState<GameModule>({
    title: "Test title",
    actions: [],
    desc: `use \`<kbd>key</kbd>\` to insert a new <kbd>key</kbd> keyboard indicator`,
    initial_code: "console.log('hello world!')",
    short_desc: "short desc",
    lang: "jsx",
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const { name, value } = e.target;
      setGameModule((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleDescChange = useCallback((vu: ViewUpdate) => {
    if (!vu.docChanged && !vu.selectionSet && !vu.viewportChanged) return;

    setGameModule((prev) => ({ ...prev, desc: vu.view.state.doc.toString() }));
  }, []);
  const handleSave = useCallback((a: GameAction[]) => {
    setGameModule((prev) => ({ ...prev, actions: a }));
  }, []);

  const handleInitialCodeChange = useCallback((vu: ViewUpdate) => {
    if (!vu.docChanged && !vu.selectionSet && !vu.viewportChanged) return;

    setGameModule((prev) => ({
      ...prev,
      initial_code: vu.view.state.doc.toString(),
    }));
  }, []);

  return (
    <div className="flex flex-col p-4 w-full">
      <Tabs defaultValue="desc" className="w-full ">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="desc">Description</TabsTrigger>
          <TabsTrigger value="initial_code">Initial Code</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="game">Debug</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="desc">
          <div className="grid grid-cols-2 py-8 gap-8">
            <div className="flex flex-col gap-4">
              <Label htmlFor="title" className="font-semibold text-lg">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={gameModule.title}
                onChange={handleInputChange}
              />

              <Label htmlFor="short_desc" className="font-semibold text-lg">
                Short Desc
              </Label>
              <Input
                id="short_desc"
                name="short_desc"
                value={gameModule.short_desc}
                onChange={handleInputChange}
              />

              <Label htmlFor="desc" className="font-semibold text-lg">
                Description (MD)
              </Label>
              <VimEditor
                id="desc"
                lang={"markdown"}
                className="text-base"
                height="30rem"
                extensions={[EditorView.lineWrapping]}
                onUpdate={handleDescChange}
                value={gameModule.desc}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {gameModule.title}
              </h2>
              <p className="text-base text-muted tracking-tight">
                {gameModule.short_desc}
              </p>
              <MarkDownReader markdown={gameModule.desc} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="initial_code">
          <div className="p-8">
            <VimEditor
              lang={gameModule.lang}
              className="text-base"
              height="30em"
              onUpdate={handleInitialCodeChange}
              value={gameModule.initial_code}
            />
          </div>
        </TabsContent>
        <TabsContent value="actions">
          {/* <ActionTester {...gameModule} onSave={handleSave} /> */}
          <ModuleActionMaker {...gameModule} onSave={handleSave} />
        </TabsContent>
        <TabsContent value="json">
          <div className="p-4">
            <div className="p-4 font-semibold">Community Module builder comming soon...</div>
            <pre className="text-wrap max-h-[60vh] overflow-y-scroll border-2 rounded-lg p-2">
              {JSON.stringify(gameModule, null, 2)}
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="game">
          <GameEditor {...gameModule} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
