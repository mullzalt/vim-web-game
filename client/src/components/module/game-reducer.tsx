export const enum GAME_ACTION {
  START,
  RESTART,
  NEXT,
  SET_CURRENT_SAFE_CODE,
  ADD_TIME,
  ADD_KEYSTROKE,
}

type GameState = {
  initial_code: string;
  current_safe_code: string;
  times: number[];
  keystrokes: number[];
  keystroke_scores: number[];
  time_scores: number[];
  current_time: number;
  current_keystroke: number;
  is_playing: boolean;
  is_winning: boolean;
  current_progress: number;
  total_progress: number;
};

export function initialize_game_state({
  initial_code = "",
  total_progress = 0,
}: Partial<GameState>): GameState {
  return {
    initial_code,
    current_safe_code: initial_code,
    times: [],
    keystrokes: [],
    keystroke_scores: [],
    time_scores: [],
    current_time: 0,
    current_keystroke: 0,
    is_playing: false,
    is_winning: false,
    current_progress: 0,
    total_progress,
  };
}

// type GameState = ReturnType<typeof initialGameState>;

type GameAction = {
  type: GAME_ACTION;
  payload?: Partial<GameState> & { intended_keystrokes?: number };
};

function calculate_keystroke_score(
  usedKeystorke: number,
  intendedKeystrokes: number,
) {
  return Math.floor((intendedKeystrokes / usedKeystorke) * 100);
}

function calculate_time_score(usedTime: number, intendedKeystrokes: number) {
  if (usedTime <= 0) usedTime = 1;
  const intendedTime = Math.floor(intendedKeystrokes * 15);
  return Math.floor((intendedTime / usedTime) * 100);
}

export const game_reducer: React.Reducer<GameState, GameAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case GAME_ACTION.START: {
      if (state.is_playing || state.is_winning) return state;
      return { ...state, is_playing: true };
    }
    case GAME_ACTION.RESTART: {
      let payload = {};
      if (action.payload) {
        const { intended_keystrokes, ...rest } = action.payload;
        payload = rest;
      }
      return action.payload ? { ...state, ...payload } : state;
    }
    case GAME_ACTION.NEXT: {
      if (!state.is_playing) return state;

      const intended_keystrokes: number =
        action.payload?.intended_keystrokes || 10;
      const {
        times,
        current_time,
        keystrokes,
        current_keystroke,
        keystroke_scores,
        time_scores,
      } = state;
      let return_states = {
        ...state,
        times: times.concat(current_time),
        current_time: 0,
        keystroke_scores: keystroke_scores.concat(
          calculate_keystroke_score(current_keystroke, intended_keystrokes),
        ),
        time_scores: time_scores.concat(
          calculate_time_score(current_time, intended_keystrokes),
        ),
        keystrokes: keystrokes.concat(current_keystroke),
        current_keystroke: 0,
        current_progress: state.current_progress + 1,
      };

      if (state.current_progress >= state.total_progress - 1) {
        return {
          ...return_states,
          is_playing: false,
          is_winning: true,
        };
      }

      return return_states;
    }
    case GAME_ACTION.ADD_TIME: {
      if (!state.is_playing) return state;
      return { ...state, current_time: state.current_time + 1 };
    }
    case GAME_ACTION.SET_CURRENT_SAFE_CODE: {
      if (!state.is_playing) return state;
      if (!action.payload?.current_safe_code) return state;
      const { current_safe_code } = action.payload;
      return { ...state, current_safe_code };
    }
    case GAME_ACTION.ADD_KEYSTROKE: {
      if (!state.is_playing) return state;
      return { ...state, current_keystroke: state.current_keystroke + 1 };
    }
    default: {
      return state;
    }
  }
};
