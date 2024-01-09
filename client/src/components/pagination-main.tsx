import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCallback, useMemo } from "react";

const range = (start: number, end: number) => {
  let length = end - start + 1;
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};

export function PaginationMain(props: {
  currentPage: number;
  totalItems: number;
  totalPage: number;
  size: number;
  sibling?: number;
  onChange?: (page: number) => void;
}) {
  const { currentPage, totalPage, sibling = 1, onChange } = props;

  const paginationRange = useMemo<number[]>(() => {
    const shownPage = sibling + 5;

    if (shownPage >= totalPage) {
      return range(1, totalPage);
    }

    const leftIndexSibling = Math.max(currentPage - sibling, 1);
    const rightIndexSibling = Math.min(currentPage + sibling, totalPage);

    const shouldShowLeftDots = leftIndexSibling > 2;
    const shouldShowRightDots = rightIndexSibling < totalPage - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPage;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * sibling;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, -1, totalPage];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * sibling;
      let rightRange = range(totalPage - rightItemCount + 1, totalPage);
      return [firstPageIndex, -1, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftIndexSibling, rightIndexSibling);
      return [firstPageIndex, -1, ...middleRange, -1, lastPageIndex];
    }

    return [];
  }, [props]);

  const handleChange = useCallback(
    (page: number) => {
      onChange && onChange(page);
    },
    [props],
  );

  return (
    <Pagination className="mt-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage === 1}
            onClick={() => handleChange(currentPage - 1)}
          />
        </PaginationItem>

        {paginationRange.map((page) => {
          if (page < 0) {
            return (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => handleChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            disabled={currentPage === totalPage}
            onClick={() => handleChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
