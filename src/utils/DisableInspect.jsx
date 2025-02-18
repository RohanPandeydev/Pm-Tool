import React, { useEffect } from 'react';

function DisableInspect() {
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
            setTimeout(() => {
                alert("Inspecting elements or viewing the source code is disabled.");
            }, 0);
        };

        const handleKeyDown = (e) => {
            if (
                e.keyCode === 123 || // F12
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
                (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
                (e.ctrlKey && e.keyCode === 85) // Ctrl+U
            ) {
                e.preventDefault();
                setTimeout(() => {
                    alert("Inspecting elements or viewing the source code is disabled.");
                }, 0);
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null; // This component doesn't render anything
}

export default DisableInspect;
