import React, { useState } from 'react';

const Pagination = ({
    pagination,
    pageid,
    handlePageChange,
    data_per_page,
}) => {
    const [showAllPages, setShowAllPages] = useState(false);

    const handleShowAllPages = () => {
        setShowAllPages(true);
    };

    const renderPageNumbers = () => {
        const pageCount = pagination?.page_count;
        const currentPage = parseInt(pageid);

        // If less than or equal to 6 pages, show all
        if (pageCount <= 6 || showAllPages) {
            return [...Array(pageCount).keys()].map(i => (
                <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                    <span className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</span>
                </li>
            ));
        }

        const pages = [];

        // Show first 2 pages
        for (let i = 0; i < 2; i++) {
            pages.push(
                <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                    <span className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</span>
                </li>
            );
        }

        // Add ellipsis and middle pages if the current page is beyond the first 3
        if (currentPage > 3 && currentPage < pageCount - 2) {
            pages.push(
                <li key="start-ellipsis" className="page-item">
                    <span className="page-link" onClick={handleShowAllPages}>...</span>
                </li>
            );

            // Show 2 pages before and after the current page
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                pages.push(
                    <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                        <span className="page-link" onClick={() => handlePageChange(i)}>{i}</span>
                    </li>
                );
            }

            pages.push(
                <li key="end-ellipsis" className="page-item">
                    <span className="page-link" onClick={handleShowAllPages}>...</span>
                </li>
            );
        } else {
            // Show ellipsis and last two pages if not in the middle pages
            pages.push(
                <li key="start-ellipsis" className="page-item">
                    <span className="page-link" onClick={handleShowAllPages}>...</span>
                </li>
            );

            // Show last two pages
            for (let i = pageCount - 2; i < pageCount; i++) {
                pages.push(
                    <li key={i} className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}>
                        <span className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</span>
                    </li>
                );
            }
        }

        return pages;
    };

    return (
        <div className="row">
            <div className="col-md-6">
                {pagination?.page_count > 0 && (
                    <nav aria-label="Page navigation">
                        <ul className="pagination pagination-sm">
                            {/* First Page Arrow */}
                            <li className={`page-item ${parseInt(pageid) === 1 ? 'disabled' : ''}`}>
                                <span className="page-link" onClick={() => handlePageChange(1)}>|&laquo;</span>
                            </li>

                            {/* Previous Page Arrow */}
                            <li className={`page-item ${parseInt(pageid) <= 1 ? 'disabled' : ''}`}>
                                <span className="page-link" onClick={() => handlePageChange(Math.max(parseInt(pageid) - 1, 1))}>&laquo;</span>
                            </li>

                            {/* Render Page Numbers */}
                            {renderPageNumbers()}

                            {/* Next Page Arrow */}
                            <li className={`page-item ${pagination?.page_count <= parseInt(pageid) ? 'disabled' : ''}`}>
                                <span className="page-link" onClick={() => handlePageChange(Math.min(parseInt(pageid) + 1, pagination?.page_count))}>&raquo;</span>
                            </li>

                            {/* Last Page Arrow */}
                            <li className={`page-item ${parseInt(pageid) === pagination?.page_count ? 'disabled' : ''}`}>
                                <span className="page-link" onClick={() => handlePageChange(pagination?.page_count)}>&raquo;|</span>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>

            <div className="col-md-6 text-end">
                {pagination?.page_count > 0 && (
                    <div className="p-2 mt-2">
                        <span style={{ fontSize: "14px" }}>
                            <span>{data_per_page?.initial_no}</span>-
                            <span>{data_per_page?.final_no}</span>
                            {" of "}
                            <span>{data_per_page?.total_no}</span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pagination;
