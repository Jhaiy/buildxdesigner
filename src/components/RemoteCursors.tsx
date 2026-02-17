"use client";

import React, { useMemo } from "react";

interface RemoteCursor {
  clientId: string;
  user: {
    id: string;
    name: string;
    color: string;
  };
  x: number;
  y: number;
}

interface RemoteCursorsProps {
  cursors: RemoteCursor[];
  zoom: number;
}

export function RemoteCursors({ cursors, zoom }: RemoteCursorsProps) {
  const scale = zoom / 100;

  return (
    <>
      {cursors.map((cursor) => (
        <div
          key={cursor.clientId}
          className="fixed pointer-events-none z-40"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            transform: `scale(${Math.max(1, 1 / scale)})`,
            transformOrigin: "top left",
          }}
        >
          <div
            className="px-3 py-1 rounded text-sm font-semibold text-white whitespace-nowrap"
            style={{
              backgroundColor: cursor.user.color,
              opacity: 0.95,
            }}
          >
            {cursor.user.name}
          </div>
        </div>
      ))}
    </>
  );
}
