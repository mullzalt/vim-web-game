import { GameAction } from "@/schema/game-module";

export const enum GAME_MODULE_ACTION {
  ADD_EMPTY_SELECT,
  ADD_EMPTY_MODIFY,
  SET_CURRENT_ACTION,
  UPDATE_CURRENT_ACTION,
  REMOVE_CURRENT_INDEX,
}

type ModuleState = {
  initialCode: string;
  currentIndex: number;
  currentCodeAfter: string;
  currentCodeBefore: string;
  lastCodeAfter: string;
  actions: GameAction[];
};

export function initializeModuleState(props: {
  initialCode?: string;
  actions?: GameAction[];
}): ModuleState {
  const { initialCode = "", actions = [] } = props;
  return {
    initialCode: initialCode,
    currentIndex: -1,
    currentCodeAfter: initialCode,
    currentCodeBefore: initialCode,
    lastCodeAfter: initialCode,
    actions,
  };
}

type ModuleAction = {
  type: GAME_MODULE_ACTION;
  payload?: {
    index?: number;
    module_action?: GameAction;
  };
};

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

export const moduleReducer: React.Reducer<ModuleState, ModuleAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case GAME_MODULE_ACTION.ADD_EMPTY_SELECT: {
      return {
        ...state,
        actions: state.actions.concat({
          action: "select",
          selection: { head: 0, anchor: 0 },
          intendedKeystrokes: 1,
        }),
        currentIndex: state.actions.length,
      };
    }

    case GAME_MODULE_ACTION.ADD_EMPTY_MODIFY: {
      return {
        ...state,
        actions: state.actions.concat({
          action: "modify",
          after: state.lastCodeAfter,
          intendedKeystrokes: 1,
        }),
        currentIndex: state.actions.length,
      };
    }

    case GAME_MODULE_ACTION.SET_CURRENT_ACTION: {
      if (typeof action.payload?.index !== "number") return state;
      const { index } = action.payload;

      if (index < 0 || index > state.actions.length - 1) return state;

      const { before, after } = getCodeFromActions(
        state.initialCode,
        state.actions,
      )[index];

      return {
        ...state,
        currentCodeBefore: before,
        currentCodeAfter: after,
        currentIndex: index,
      };
    }

    case GAME_MODULE_ACTION.UPDATE_CURRENT_ACTION: {
      if (!action.payload?.module_action) return state;
      const { module_action } = action.payload;
      const { actions, currentIndex: current_index } = state;
      let {
        currentCodeAfter: current_code_after,
        lastCodeAfter: last_code_after,
      } = state;

      if (current_index < 0 || current_index >= actions.length) return state;

      const update: GameAction[] = [
        ...actions.slice(0, current_index),
        { ...module_action },
        ...actions.slice(current_index + 1),
      ];

      if (module_action.action === "modify") {
        current_code_after = module_action.after;
      }

      if (
        current_index >= actions.length - 1 &&
        module_action.action === "modify"
      ) {
        last_code_after = module_action.after;
      }

      return {
        ...state,
        actions: update,
        currentCodeAfter: current_code_after,
        lastCodeAfter: last_code_after,
      };
    }

    case GAME_MODULE_ACTION.REMOVE_CURRENT_INDEX: {
      if (typeof action.payload?.index !== "number") return state;
      const { index } = action.payload;

      if (index < 0 || index > state.actions.length - 1) return state;
      const { actions, currentIndex: current_index } = state;
      const update: GameAction[] = [
        ...actions.slice(0, index),
        ...actions.slice(index + 1),
      ];
      return {
        ...state,
        actions: update,
        currentIndex: current_index === index ? -1 : current_index,
      };
    }
  }
};
