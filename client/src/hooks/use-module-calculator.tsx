import { GameModuleRequest } from "@/stores/game-module";
import { useEffect, useMemo, useState } from "react";

export function useScoreCalculator() {}

export function useModuleCalculator(props: Partial<GameModuleRequest>) {
  const [data, setData] = useState({
    lang: "",
    length: 0,
    codeLengthMin: 0,
    codeLengthMax: 0,
    ssKeystroke: 0,
    ssTime: 0,
  });

  useEffect(() => {
    const {
      lang,
      actions = [],
      initialCode = "",
      intendedKeystrokes = 0,
    } = props;
    const codeLength = actions.flatMap((a) => {
      if (a.action === "select") return [];

      return [a.after.length];
    });
    const codeLengthMin = Math.min(initialCode.length, ...codeLength);
    const codeLengthMax = Math.max(initialCode.length, ...codeLength);
    const ssKeystroke = intendedKeystrokes;
    const ssTime = Number(((intendedKeystrokes * 20) / 100).toFixed(2));

    setData({
      lang: lang ? lang : "Plain text",
      length: actions.length,
      codeLengthMin,
      codeLengthMax,
      ssKeystroke,
      ssTime,
    });
  }, [props]);

  return useMemo(() => ({ ...data }), [data]);
}
