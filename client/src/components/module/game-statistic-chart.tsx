import { forwardRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { GameStatisticData } from "@/schema/game-module";

interface GameStatisticProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Partial<GameStatisticData> {}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
);

export function assignGrade(grade: number): {
  grade: string;
  comment: string;
} {
  if (grade > 100) {
    return {
      grade: "SS",
      comment: "Seems Standard",
    };
  }
  if (grade > 90) {
    return {
      grade: "S",
      comment: "Still average",
    };
  }
  if (grade > 80) {
    return {
      grade: "A",
      comment: "Average",
    };
  }
  if (grade > 70) {
    return {
      grade: "B",
      comment: "Below average",
    };
  }
  if (grade > 60) {
    return {
      grade: "C",
      comment: "Come back when you better",
    };
  }
  if (grade > 50) {
    return {
      grade: "D",
      comment: "Do you even try?",
    };
  }
  return {
    grade: "F",
    comment: "Find a new editor",
  };
}

export const GameStatisticChart = forwardRef<
  HTMLDivElement,
  GameStatisticProps
>((props, ref) => {
  const {
    times = [],
    timeTotal = 0,
    timeScores = [],
    timeScoreTotal = 0,
    keystrokes = [],
    keystrokeTotal = 0,
    keystrokeScores = [],
    keystrokeScoreTotal = 0,
    totalScore = 0,
    gradeTime = 0,
    gradeKeystroke = 0,
    gradeOverall = 0,
    className,
    ...other
  } = props;

  const options = ({ suggestedMax = 10, reverse = true, title = "" }) => ({
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      colors: {
        enabled: true,
      },
      title: {
        display: Boolean(title),
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        reverse,
        suggestedMax,
      },
    },
  });

  const labels = times.map(() => "");

  // const totalKsScore = _totalKsScore || ksScore.reduce((a, b) => a + b, 0);
  // const totalTimeScore =
  //   _totalTimeScore || timeScore.reduce((a, b) => a + b, 0);
  //
  // const totalScore = _totalScore || totalKsScore + totalTimeScore;
  const timesInSec = times.map((t) => t / 100);
  // const avgTimeScore = totalTimeScore / times.length;
  // const avgKsScore = totalKsScore / keystrokes.length;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 gap-2 border-2 rounded-md p-4 border-border "
      {...other}
    >
      <div className="flex flex-col justify-center gap-4 border-border border-2 rounded-md p-4">
        <div className="flex items-center gap-4">
          <span>Score:</span>
          <span className="font-black text-2xl">{totalScore}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Times:</span>
          <span className="font-black text-xl">
            {timesInSec.reduce((a, b) => a + b, 0).toFixed(2) + " seconds"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Keystrokes:</span>
          <span className="font-black text-xl">{keystrokeTotal}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 border-border border-2 rounded-md p-4 ">
        <div className="col-span-1 flex flex-col w-full h-full justify-center items-center">
          <span>Overall Grade ({gradeOverall}): </span>
          <span className="text-6xl italic font-black">
            {assignGrade(gradeOverall).grade}
          </span>
        </div>
        <div className="col-span-3">
          <Line
            options={options({
              suggestedMax: 100,
              reverse: false,
              title: "Performance",
            })}
            data={{
              labels,
              datasets: [
                {
                  label: "Time Score",
                  data: timeScores,
                },
                {
                  label: "Keystrokes Score",
                  data: keystrokeScores,
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 border-border border-2 rounded-md p-4">
        <div className="col-span-1 flex flex-col w-full h-full justify-center items-center">
          <span>Time Grade ({gradeTime}): </span>
          <span className="text-6xl italic font-black">
            {assignGrade(gradeTime).grade}
          </span>
        </div>
        <div className="col-span-3">
          <Line
            options={options({
              suggestedMax: 5,
              reverse: true,
              title: "Times",
            })}
            data={{
              labels,
              datasets: [
                {
                  label: "Time in seconds",
                  data: timesInSec,
                },
              ],
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 border-border border-2 rounded-md p-4">
        <div className="col-span-1 flex flex-col w-full h-full justify-center items-center">
          <span>Keystroke Grade ({gradeKeystroke}): </span>
          <span className="text-6xl italic font-black">
            {assignGrade(gradeKeystroke).grade}
          </span>
        </div>
        <div className="col-span-3">
          <Line
            options={options({
              suggestedMax: 5,
              reverse: true,
              title: "Keystrokes",
            })}
            data={{
              labels,
              datasets: [
                {
                  label: "Keystrokes",
                  data: keystrokes,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
});
