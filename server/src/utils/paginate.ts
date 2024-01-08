export function paginate(page: number = 1, size: number = 10) {
  const skip = (page - 1) * size;
  const take = size;

  return {
    skip,
    take,
    current_page: page,
  };
}

export function count_paginate({
  take,
  count,
}: {
  take: number;
  count: number;
}) {
  return {
    total_items: count,
    total_page: Math.ceil(count / take),
  };
}
