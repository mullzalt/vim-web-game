export function calculateLevel(exp: number) {
  const EXP_INCREASE = 1000;

  let level = 1;
  let required_exp = EXP_INCREASE;

  while (exp >= required_exp) {
    exp -= required_exp;
    level += 1;
    required_exp += EXP_INCREASE;
  }

  return {
    level,
    required_exp,
    exp,
  };
}
