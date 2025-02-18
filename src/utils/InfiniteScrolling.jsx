import React, { useRef, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ButtonLoader from "./Loader/ButtonLoader";

const InfiniteScrolling = ({
    items,
    children,
    hasMore,
    setPage,
}) => {
    const scrollableRef = useRef(null);
    const [previousScrollHeight, setPreviousScrollHeight] = useState(0);

    const increasePage = () => {
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        const scrollableElement = scrollableRef.current;

        if (scrollableElement) {
            // Save the current scroll height before updating the items
            setPreviousScrollHeight(scrollableElement.scrollHeight);
        }
    }, [items]);

    useEffect(() => {
        const scrollableElement = scrollableRef.current;

        if (scrollableElement && previousScrollHeight) {
            // Maintain the scroll position after items are updated
            scrollableElement.scrollTop += (scrollableElement.scrollHeight - previousScrollHeight);
        }
    }, [items, previousScrollHeight]);

    return (
        <div id="scrollableDiv" ref={scrollableRef} style={{ height: '100vh', overflow: 'hide' }}>
            <InfiniteScroll
                dataLength={items.length} // Length of items to determine when to load more
                next={increasePage} // Function to call when reaching bottom
                hasMore={hasMore} // Whether there are more items to load
                loader={<ButtonLoader />} // Loader shown when loading more items
                endMessage={
                    <p style={{ textAlign: "center" }}>
                        <b>No more content available.</b>
                    </p>
                } // Message when all items are loaded
                scrollableTarget="scrollableDiv" // Use the same container for scrolling
            >
                {children}
            </InfiniteScroll>
        </div>
    );
};

export default InfiniteScrolling;
