import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
}

export const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  itemLabel = "data",
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIdx = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIdx = Math.min(safeCurrentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push("...");
      for (let i = Math.max(2, safeCurrentPage - 1); i <= Math.min(totalPages - 1, safeCurrentPage + 1); i++) {
        pages.push(i);
      }
      if (safeCurrentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-3 border-t border-border/30 bg-gray-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:bg-charcoal/30 dark:border-charcoal/60">
      {/* Left: Page size selector & info */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground dark:text-forest-100/70">Tampilkan</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="rounded-md border border-border bg-white px-2 py-1 text-xs font-medium text-charcoal focus:border-forest-700 focus:outline-none dark:border-charcoal/60 dark:bg-charcoal dark:text-forest-100"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground dark:text-forest-100/70">per halaman</span>
        </div>
        <span className="text-xs text-muted-foreground dark:text-forest-100/70">
          | Menampilkan {startIdx}–{endIdx} dari {totalItems} {itemLabel}
        </span>
      </div>

      {/* Right: Page navigation */}
      <div className="flex flex-wrap items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
          disabled={safeCurrentPage <= 1}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-charcoal hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-charcoal/60 dark:bg-charcoal dark:text-forest-100 dark:hover:bg-charcoal/80"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Sebelumnya
        </button>

        {getPageNumbers().map((page, i) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-xs text-muted-foreground select-none dark:text-forest-100/60">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                safeCurrentPage === page
                  ? "bg-forest-900 text-white shadow-xs dark:bg-forest-700"
                  : "border border-border bg-white text-charcoal hover:bg-gray-50 dark:border-charcoal/60 dark:bg-charcoal dark:text-forest-100 dark:hover:bg-charcoal/80"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, safeCurrentPage + 1))}
          disabled={safeCurrentPage >= totalPages}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-charcoal hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-charcoal/60 dark:bg-charcoal dark:text-forest-100 dark:hover:bg-charcoal/80"
        >
          Selanjutnya
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
