import { VimEditor } from "@/components/game/editor-base";
import { ModuleActionMaker } from "@/components/module/game-actions-maker";
import { GameEditor } from "@/components/module/game-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkDownReader } from "@/components/ui/markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameModule, GameAction } from "@/schema/game-module";
import { LanguageName } from "@uiw/codemirror-extensions-langs";
import { EditorView, ViewUpdate } from "@uiw/react-codemirror";
import { useCallback, useEffect, useState } from "react";

export function SandboxPage(props: {
  module?: GameModule;
  onUpdate?: (game_module: GameModule) => void;
}) {
  const { module, onUpdate } = props;
  const [gameModule, setGameModule] = useState<GameModule>(
    module || {
      title: "Test title",
      actions: [],
      desc: `use \`<kbd>key</kbd>\` to insert a new <kbd>key</kbd> keyboard indicator`,
      initial_code: "console.log('hello world!')",
      short_desc: "short desc",
      lang: "jsx",
    },
  );

  useEffect(() => {
    onUpdate && onUpdate(gameModule);
  }, [gameModule]);

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
              lang={gameModule.lang as LanguageName}
              className="text-base"
              height="30em"
              onUpdate={handleInitialCodeChange}
              value={gameModule.initial_code}
            />
          </div>
        </TabsContent>
        <TabsContent value="actions">
          <ModuleActionMaker {...gameModule} onSave={handleSave} />
        </TabsContent>
        <TabsContent value="json">
          <div className="p-4">
            <div className="p-4 font-semibold">
              Community Module builder comming soon...
            </div>
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
