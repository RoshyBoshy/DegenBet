import React, { useState, useRef, useEffect } from "react";

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
    <div
      className="fixed inset-0 overflow-hidden bg-primary pt-14"
      ref={gridRef}
    >
      {/* Direction controls */}
      <div className="fixed top-1/2 left-10 transform -translate-y-1/2 z-20 flex flex-col gap-2">
        <button
          onClick={() => navigateGrid("W")}
          className="w-10 h-10 rounded-full bg-secondary text-white border border-accent flex items-center justify-center hover:bg-accent transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      </div>
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => navigateGrid("N")}
          className="w-10 h-10 rounded-full bg-secondary text-white border border-accent flex items-center justify-center hover:bg-accent transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>
      </div>
      <div className="fixed top-1/2 right-10 transform -translate-y-1/2 z-20">
        <button
          onClick={() => navigateGrid("E")}
          className="w-10 h-10 rounded-full bg-secondary text-white border border-accent flex items-center justify-center hover:bg-accent transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={() => navigateGrid("S")}
          className="w-10 h-10 rounded-full bg-secondary text-white border border-accent flex items-center justify-center hover:bg-accent transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
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
      <div className="fixed bottom-10 right-10 z-20 flex gap-2">
        <button
          onClick={() => handleZoom(false)}
          className="w-10 h-10 rounded-full bg-secondary text-white border border-accent flex items-center justify-center hover:bg-accent transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-secondary text-white border border-accent flex items-center justify-center">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => handleZoom(true)}
          className="w-10 h-10 rounded-full bg-secondary text-white border border-accent flex items-center justify-center hover:bg-accent transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
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
        className="absolute inset-0 cursor-grab"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="relative w-full h-full bg-primary">
          {/* Solid background color */}
          {/* Children will be centered in the grid */}
          <div className="flex items-center justify-center min-h-screen">
            <div className="transform scale-100">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandingGrid;
