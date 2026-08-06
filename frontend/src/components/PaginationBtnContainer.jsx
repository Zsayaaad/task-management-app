import { useLocation, useNavigate } from "react-router-dom";
import { useProjectTasksContext } from "../context/ProjectTasksContext";

const PaginationBtnContainer = () => {
  const { data } = useProjectTasksContext();
  const { pagination } = data;
  const { currentPage, totalPages } = pagination;

  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set("page", pageNumber);
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <p className="text-xs text-text-muted">
        Page{" "}
        <span className="text-on-surface font-semibold">{currentPage}</span> of{" "}
        <span className="text-on-surface font-semibold">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1.5 rounded-lg border border-border text-on-surface hover:bg-surface-bright disabled:opacity-40 font-button text-xs transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">
            chevron_left
          </span>
          Previous
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1.5 rounded-lg border border-border text-on-surface hover:bg-surface-bright disabled:opacity-40 font-button text-xs transition-colors flex items-center gap-1"
        >
          Next
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};

export default PaginationBtnContainer;
