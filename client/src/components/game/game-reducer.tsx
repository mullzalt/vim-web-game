export const enum GAME_ACTION {
  START,
  RESTART,
  NEXT,
  SET_CURRENT_SAFE_CODE,
  ADD_TIME,
  ADD_KEYSTROKE,
  ASSIGN_TIMES,
  ASSIGN_KEYSTROKES,
  ADD_SCORE,
}

type GameState = {
  initialCode: string;
  currentSafeCode: string;
  times: number[];
  keystrokes: number[];
  score: number;
  currentTime: number;
  currentKeystrokes: number;
  isPlaying: boolean;
  isWinning: boolean;
  currentProgress: number;
  totalProgress: number;
};

export function initialGameState(
  code: string = "",
  length: number = 0,
): GameState {
  return {
    initialCode: code,
    currentSafeCode: code,
    times: [],
    keystrokes: [],
    score: 0,
    currentTime: 0,
    currentKeystrokes: 0,
    isPlaying: false,
    isWinning: false,
    currentProgress: 0,
    totalProgress: length,
  };
}

// type GameState = ReturnType<typeof initialGameState>;

type GameAction = {
  type: GAME_ACTION;
  payload?: Partial<GameState>;
};

export const gameReducer: React.Reducer<GameState, GameAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case GAME_ACTION.START: {
      if (state.isPlaying || state.isWinning) return state;
      return { ...state, isPlaying: true };
    }
    case GAME_ACTION.RESTART: {
      return action.payload ? { ...state, ...action.payload } : state;
    }
    case GAME_ACTION.NEXT: {
      if (!state.isPlaying) return state;
      if (state.currentProgress >= state.totalProgress - 1) {
        return {
          ...state,
          currentProgress: state.currentProgress + 1,
          isPlaying: false,
          isWinning: true,
        };
      }
      return { ...state, currentProgress: state.currentProgress + 1 };
    }
    case GAME_ACTION.ADD_TIME: {
      if (!state.isPlaying) return state;
      return { ...state, currentTime: state.currentTime + 1 };
    }
    case GAME_ACTION.SET_CURRENT_SAFE_CODE: {
      if (!state.isPlaying) return state;
      if (!action.payload?.currentSafeCode) return state;
      const { currentSafeCode } = action.payload;
      return { ...state, currentSafeCode };
    }
    case GAME_ACTION.ADD_KEYSTROKE: {
      if (!state.isPlaying) return state;
      return { ...state, currentKeystrokes: state.currentKeystrokes + 1 };
    }
    case GAME_ACTION.ADD_SCORE: {
      if (!state.isPlaying) return state;
      if (!action.payload?.score) return state;
      return { ...state, score: state.score + action.payload.score };
    }
    case GAME_ACTION.ASSIGN_TIMES: {
      if (!state.isPlaying) return state;
      const { times, currentTime } = state;
      return { ...state, times: times.concat(currentTime), currentTime: 0 };
    }
    case GAME_ACTION.ASSIGN_KEYSTROKES: {
      if (!state.isPlaying) return state;
      const { keystrokes, currentKeystrokes } = state;
      return {
        ...state,
        keystrokes: keystrokes.concat(currentKeystrokes),
        currentKeystrokes: 0,
      };
    }
    default: {
      return state;
    }
  }
};
