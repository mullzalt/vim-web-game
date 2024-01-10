import { cn } from "@/lib/utils";
import { useMemo } from "react";

export function AssignGrade(
  props: React.HTMLAttributes<HTMLSpanElement> & {
    grade?: number;
  },
) {
  const { grade = 0, className = "", ...other } = props;

  const gradeSymbol = useMemo(() => {
    if (grade >= 100) return "SS";
    if (grade >= 90) return "S";
    if (grade >= 80) return "A";
    if (grade >= 70) return "B";
    if (grade >= 60) return "C";
    if (grade >= 50) return "D";
    return "F";
  }, [grade]);

  return (
    <span className={cn("uppercase", className)} {...other}>
      {gradeSymbol}
    </span>
  );
}
