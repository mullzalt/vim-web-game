export function paginate(page: string = "1", size: string = "10") {
  const _page = Math.max(1, parseInt(page as string));
  const _size = Math.max(1, parseInt(size as string));
  const skip = (_page - 1) * _size;
  const take = _size;

  return {
    skip,
    take,
    current_page: _page,
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
