import { GameAction } from "@/schema/game-module";

export const enum GAME_MODULE_ACTION {
  ADD_EMPTY_SELECT,
  ADD_EMPTY_MODIFY,
  SET_CURRENT_ACTION,
  UPDATE_CURRENT_ACTION,
  REMOVE_CURRENT_INDEX,
}

type ModuleState = {
  initial_code: string;
  current_index: number;
  current_code_after: string;
  current_code_before: string;
  last_code_after: string;
  actions: GameAction[];
};

export function initializeModuleState(props: {
  initial_code?: string;
  actions?: GameAction[];
}): ModuleState {
  const { initial_code = "", actions = [] } = props;
  return {
    initial_code,
    current_index: -1,
    current_code_after: initial_code,
    current_code_before: initial_code,
    last_code_after: initial_code,
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
          intended_keystrokes: 1,
        }),
        current_index: state.actions.length,
      };
    }

    case GAME_MODULE_ACTION.ADD_EMPTY_MODIFY: {
      return {
        ...state,
        actions: state.actions.concat({
          action: "modify",
          after: state.last_code_after,
          intended_keystrokes: 1,
        }),
        current_index: state.actions.length,
      };
    }

    case GAME_MODULE_ACTION.SET_CURRENT_ACTION: {
      if (typeof action.payload?.index !== "number") return state;
      const { index } = action.payload;

      if (index < 0 || index > state.actions.length - 1) return state;

      const { before, after } = getCodeFromActions(
        state.initial_code,
        state.actions,
      )[index];

      return {
        ...state,
        current_code_before: before,
        current_code_after: after,
        current_index: index,
      };
    }

    case GAME_MODULE_ACTION.UPDATE_CURRENT_ACTION: {
      if (!action.payload?.module_action) return state;
      const { module_action } = action.payload;
      const { actions, current_index } = state;
      let { current_code_after, last_code_after } = state;

      if (current_index < 0 || current_index >= actions.length) return;

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

      return { ...state, actions: update, current_code_after, last_code_after };
    }

    case GAME_MODULE_ACTION.REMOVE_CURRENT_INDEX: {
      if (typeof action.payload?.index !== "number") return state;
      const { index } = action.payload;

      if (index < 0 || index > state.actions.length - 1) return state;
      const { actions, current_index } = state;
      const update: GameAction[] = [
        ...actions.slice(0, index),
        ...actions.slice(index + 1),
      ];
      return {
        ...state,
        actions: update,
        current_index: current_index === index ? -1 : current_index,
      };
    }
  }
};
