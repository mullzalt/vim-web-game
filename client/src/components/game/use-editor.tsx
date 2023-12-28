import {
  Annotation,
  EditorState,
  EditorStateConfig,
  EditorView,
  Extension,
  StateEffect,
  ViewUpdate,
  getDefaultExtensions,
} from "@uiw/react-codemirror";
import { useEffect, useState } from "react";

export interface UseEditor
  extends Omit<EditorStateConfig, "doc" | "extensions"> {
  /** value of the auto created model in the editor. */
  value?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  /** focus on the editor. */
  autoFocus?: boolean;
  /** Enables a placeholder—a piece of example content to show when the editor is empty. */
  placeholder?: string | HTMLElement;
  /**
   * `light` / `dark` / `Extension` Defaults to `light`.
   * @default light
   */
  theme?: "light" | "dark" | "none" | Extension;
  /**
   * Whether to optional basicSetup by default
   * @default true
   */
  // basicSetup?: boolean | BasicSetupOptions;
  /**
   * This disables editing of the editor content by the user.
   * @default true
   */
  editable?: boolean;
  /**
   * This disables editing of the editor content by the user.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Controls whether pressing the `Tab` key inserts a tab character and indents the text (`true`)
   * or behaves according to the browser's default behavior (`false`).
   * @default true
   */
  indentWithTab?: boolean;
  /** Fired whenever a change occurs to the document. */
  // onChange?(value: string, viewUpdate: ViewUpdate): void;
  /** Some data on the statistics editor. */
  // onStatistics?(data: Statistics): void;
  /** Fired whenever any state change occurs within the editor, including non-document changes like lint results. */
  onUpdate?(viewUpdate: ViewUpdate): void;
  /** The first time the editor executes the event. */
  onCreateEditor?(view: EditorView, state: EditorState): void;
  /**
   * Extension values can be [provided](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions) when creating a state to attach various kinds of configuration and behavior information.
   * They can either be built-in extension-providing objects,
   * such as [state fields](https://codemirror.net/6/docs/ref/#state.StateField) or [facet providers](https://codemirror.net/6/docs/ref/#state.Facet.of),
   * or objects with an extension in its `extension` property. Extensions can be nested in arrays arbitrarily deep—they will be flattened when processed.
   */
  extensions?: Extension[];
  /**
   * If the view is going to be mounted in a shadow root or document other than the one held by the global variable document (the default), you should pass it here.
   * Originally from the [config of EditorView](https://codemirror.net/6/docs/ref/#view.EditorView.constructor%5Econfig.root)
   */
  root?: ShadowRoot | Document;
  /**
   * Create a state from its JSON representation serialized with [toJSON](https://codemirror.net/docs/ref/#state.EditorState.toJSON) function
   */
  // initialState?: {
  //   json: any;
  //   fields?: Record<string, StateField<any>>;
  // };
  container?: HTMLDivElement | null;
}

const External = Annotation.define<boolean>();

const emptyExtensions: Extension[] = [];

export function useEditor(props: UseEditor) {
  const {
    value,
    selection,
    onUpdate,
    onCreateEditor,
    extensions = emptyExtensions,
    autoFocus,
    theme = "light",
    height = null,
    minHeight = null,
    maxHeight = null,
    width = null,
    minWidth = null,
    maxWidth = null,
    placeholder: placeholderStr = "",
    editable = true,
    readOnly = false,
    indentWithTab: defaultIndentWithTab = true,
    root,
  } = props;

  const [container, setContainer] = useState<HTMLDivElement>();
  const [view, setView] = useState<EditorView>();
  const [state, setState] = useState<EditorState>();

  const defaultThemeOption = EditorView.theme({
    "&": {
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
    },
    "& .cm-scroller": {
      height: "100% !important",
    },
  });

  const defaultExtensions = getDefaultExtensions({
    theme,
    editable,
    readOnly,
    placeholder: placeholderStr,
    indentWithTab: defaultIndentWithTab,
    basicSetup: {
      foldKeymap: false,
      lintKeymap: false,
      historyKeymap: false,
      completionKeymap: false,
      autocompletion: false,
      defaultKeymap: false,
      searchKeymap: false,
      foldGutter: false,
      closeBracketsKeymap: false,
    },
  });

  let getExtensions = [defaultThemeOption, ...defaultExtensions];

  if (onUpdate && typeof onUpdate === "function") {
    getExtensions.push(EditorView.updateListener.of(onUpdate));
  }
  getExtensions = getExtensions.concat(extensions);

  useEffect(() => {
    if (container && !state) {
      const config = {
        doc: value,
        selection,
        extensions: getExtensions,
      };
      const stateCurrent = EditorState.create(config);
      setState(stateCurrent);
      if (!view) {
        const viewCurrent = new EditorView({
          state: stateCurrent,
          parent: container,
          root,
        });
        setView(viewCurrent);
        onCreateEditor && onCreateEditor(viewCurrent, stateCurrent);
      }
    }
    return () => {
      if (view) {
        setState(undefined);
        setView(undefined);
      }
    };
  }, [container, state]);

  useEffect(() => setContainer(props.container!), [props.container]);

  useEffect(
    () => () => {
      if (view) {
        view.destroy();
        setView(undefined);
      }
    },
    [view],
  );

  useEffect(() => {
    if (autoFocus && view) {
      view.focus();
    }
  }, [autoFocus, view]);

  useEffect(() => {
    if (view) {
      view.dispatch({ effects: StateEffect.reconfigure.of(getExtensions) });
    }
  }, [
    theme,
    extensions,
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    placeholderStr,
    editable,
    readOnly,
    defaultIndentWithTab,
    onUpdate,
  ]);

  useEffect(() => {
    if (value === undefined) {
      return;
    }
    const currentValue = view ? view.state.doc.toString() : "";
    if (view && value !== currentValue) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value || "" },
        annotations: [External.of(true)],
      });
    }
  }, [value, view]);

  return {
    state,
    setState,
    view,
    setView,
    container,
    setContainer,
    extensions: getExtensions,
  };
}
