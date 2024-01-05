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
  keystrokeScores: number[];
  timeScores: number[];
  currentTime: number;
  currentKeystroke: number;
  isPlaying: boolean;
  isWinning: boolean;
  currentProgress: number;
  totalProgress: number;
};

export function initializeGameState({
  initialCode = "",
  totalProgress = 0,
}: Partial<GameState>): GameState {
  return {
    initialCode,
    currentSafeCode: initialCode,
    times: [],
    keystrokes: [],
    keystrokeScores: [],
    timeScores: [],
    currentTime: 0,
    currentKeystroke: 0,
    isPlaying: false,
    isWinning: false,
    currentProgress: 0,
    totalProgress: totalProgress,
  };
}

type GameAction = {
  type: GAME_ACTION;
  payload?: Partial<GameState> & { intendedKeystrokes?: number };
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
        currentKeystroke,
        keystrokeScores,
        timeScores,
      } = state;
      let return_states = {
        ...state,
        times: times.concat(currentTime),
        currentTime: 0,
        keystrokeScores: keystrokeScores.concat(
          calculate_keystroke_score(currentKeystroke, intendedKeystrokes),
        ),
        timeScores: timeScores.concat(
          calculate_time_score(currentTime, intendedKeystrokes),
        ),
        keystrokes: keystrokes.concat(currentKeystroke),
        currentKeystroke: 0,
        currentProgress: state.currentProgress + 1,
      };

      if (state.currentProgress >= state.totalProgress - 1) {
        return {
          ...return_states,
          isPlaying: false,
          isWinning: true,
        };
      }

      return return_states;
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
      return { ...state, currentKeystroke: state.currentKeystroke + 1 };
    }
    default: {
      return state;
    }
  }
};
