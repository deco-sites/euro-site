export type Props = {
  pageInfo: {
    currentPage: number;
    nextPage?: string;
    previousPage?: string;
  };
};

export default function SearchPagination({ pageInfo }: Props) {
  return (
    <div class="flex justify-center my-5 gap-[10px]">
      {pageInfo.previousPage && (
        <a
          aria-label="previous page link"
          rel="prev"
          href={pageInfo.previousPage ?? "#"}
          class="w-10 h-10 border-2 border-base-200 text-base-300 rounded-full flex items-center justify-center text-sm font-bold"
        >
          {pageInfo.currentPage - 1}
        </a>
      )}
      <span class="w-10 h-10 bg-base-content rounded-full text-base-100 flex items-center justify-center text-sm font-bold">
        {pageInfo.currentPage}
      </span>
      {pageInfo.nextPage && (
        <a
          aria-label="next page link"
          rel="next"
          href={pageInfo.nextPage ?? "#"}
          class="w-10 h-10 border-2 border-base-200 text-base-300 rounded-full flex items-center justify-center text-sm font-bold"
        >
          {pageInfo.currentPage + 1}
        </a>
      )}
    </div>
  );
}
