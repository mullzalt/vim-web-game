export const enum GAME_ACTION {
  START,
  RESTART,
  NEXT,
  SET_CURRENT_SAFE_CODE,
  ADD_TIME,
  ADD_KEYSTROKE,
}

type GameState = {
  initialCode: string;
  currentSafeCode: string;
  times: number[];
  keystrokes: number[];
  ksScore: number[];
  timeScore: number[];
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
    ksScore: [],
    timeScore: [],
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
  payload?: Partial<GameState> & { intendedKeystrokes?: number };
};

function calculateKsScore(usedKeystorke: number, intendedKeystrokes: number) {
  return Math.floor((intendedKeystrokes / usedKeystorke) * 100);
}

function calculateTimeScore(usedTime: number, intendedKeystrokes: number) {
  if (usedTime <= 0) usedTime = 1;
  const intendedTime = Math.floor(intendedKeystrokes * 15);
  return Math.floor((intendedTime / usedTime) * 100);
}

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
      let payload = {};
      if (action.payload) {
        const { intendedKeystrokes, ...rest } = action.payload;
        payload = rest;
      }
      return action.payload ? { ...state, ...payload } : state;
    }
    case GAME_ACTION.NEXT: {
      if (!state.isPlaying) return state;

      const intendedKeystrokes: number =
        action.payload?.intendedKeystrokes || 10;
      const {
        times,
        currentTime,
        keystrokes,
        currentKeystrokes,
        ksScore,
        timeScore,
      } = state;
      let returnState = {
        ...state,
        times: times.concat(currentTime),
        currentTime: 0,
        ksScore: ksScore.concat(
          calculateKsScore(currentKeystrokes, intendedKeystrokes),
        ),
        timeScore: timeScore.concat(
          calculateTimeScore(currentTime, intendedKeystrokes),
        ),
        keystrokes: keystrokes.concat(currentKeystrokes),
        currentKeystrokes: 0,
        currentProgress: state.currentProgress + 1,
      };

      if (state.currentProgress >= state.totalProgress - 1) {
        return {
          ...returnState,
          isPlaying: false,
          isWinning: true,
        };
      }

      return returnState;
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
    default: {
      return state;
    }
  }
};
