export default function Pagination({
  currentPage,
  totalPages,
  urlPattern = "query", // 'query' for ?page=X, 'path' for /page/X
}: {
  currentPage: number;
  totalPages: number;
  urlPattern?: "query" | "path";
}) {
  const getPageUrl = (pageNum: number) => {
    return urlPattern === "query" ? `?page=${pageNum}` : `/page/${pageNum}`;
  };

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <>
          <a href={getPageUrl(currentPage - 1)}>Previous</a>
          {" | "}
        </>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <span key={page}>
          {page === currentPage ? (
            <span className="current-page">{page}</span>
          ) : (
            <a href={getPageUrl(page)}>{page}</a>
          )}
          {page < totalPages && " | "}
        </span>
      ))}

      {currentPage < totalPages && (
        <>
          {" | "}
          <a href={getPageUrl(currentPage + 1)}>Next</a>
        </>
      )}
    </div>
  );
}
