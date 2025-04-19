import React, { useState, useRef, useEffect } from "react";
import styles from "./ExpandingGrid.module.css";

const ExpandingGrid = ({ children }) => {
  // State for grid position and zoom
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const gridRef = useRef(null);

  // Handle grid navigation via directional buttons
  const navigateGrid = (direction) => {
    const step = 100; // pixels to move per step

    switch (direction) {
      case "N":
        setPosition((prev) => ({ ...prev, y: prev.y + step }));
        break;
      case "S":
        setPosition((prev) => ({ ...prev, y: prev.y - step }));
        break;
      case "E":
        setPosition((prev) => ({ ...prev, x: prev.x - step }));
        break;
      case "W":
        setPosition((prev) => ({ ...prev, x: prev.x + step }));
        break;
      default:
        break;
    }
  };

  // Handle zoom controls
  const handleZoom = (zoomIn) => {
    setZoom((prev) => {
      const newZoom = zoomIn ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(newZoom, 0.5), 2); // Limit zoom between 0.5x and 2x
    });
  };

  // Handle grid dragging with mouse
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners for mouse drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div className={styles.gridContainer} ref={gridRef}>
      {/* Direction controls */}
      <div className={styles.navControlLeft}>
        <button
          onClick={() => navigateGrid("W")}
          className={styles.controlButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.controlIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      </div>
      <div className={styles.navControlTop}>
        <button
          onClick={() => navigateGrid("N")}
          className={styles.controlButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.controlIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
      </div>
      <div className={styles.navControlRight}>
        <button
          onClick={() => navigateGrid("E")}
          className={styles.controlButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.controlIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
      <div className={styles.navControlBottom}>
        <button
          onClick={() => navigateGrid("S")}
          className={styles.controlButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.controlIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </div>

      {/* Zoom controls */}
      <div className={styles.zoomControls}>
        <button
          onClick={() => handleZoom(false)}
          className={styles.controlButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.controlIcon}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
          </svg>
        </button>
        <div className={styles.zoomDisplay}>{Math.round(zoom * 100)}%</div>
        <button
          onClick={() => handleZoom(true)}
          className={styles.controlButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.controlIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
        </button>
      </div>

      {/* Grid container with transform based on position and zoom */}
      <div
        className={styles.gridContent}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.gridBackground}>
          {/* Solid background color */}
          {/* Children will be centered in the grid */}
          <div className={styles.gridCenteredContent}>
            <div className={styles.gridInnerContent}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandingGrid;
