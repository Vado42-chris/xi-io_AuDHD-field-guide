import React from 'react';

type IconProps = { className?: string };

const svg = (props: React.SVGProps<SVGSVGElement>, ...children: React.ReactNode[]) => React.createElement('svg', props, ...children);
const line = (props: React.SVGProps<SVGLineElement>) => React.createElement('line', props);
const path = (props: React.SVGProps<SVGPathElement>) => React.createElement('path', props);
const circle = (props: React.SVGProps<SVGCircleElement>) => React.createElement('circle', props);
const rect = (props: React.SVGProps<SVGRectElement>) => React.createElement('rect', props);
const polygon = (props: React.SVGProps<SVGPolygonElement>) => React.createElement('polygon', props);
const polyline = (props: React.SVGProps<SVGPolylineElement>) => React.createElement('polyline', props);

export const Icons = {
  Menu: () => svg({ width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5' },
    line({ x1: 4, y1: 12, x2: 20, y2: 12 }),
    line({ x1: 4, y1: 6, x2: 20, y2: 6 }),
    line({ x1: 4, y1: 18, x2: 20, y2: 18 })
  ),

  Home: () => svg({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    path({ d: 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' })
  ),

  Journal: () => svg({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    path({ d: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' })
  ),

  User: () => svg({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    path({ d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
    circle({ cx: 12, cy: 7, r: 4 })
  ),

  Bolt: ({ className = '' }: IconProps = {}) => svg({ className, width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    polygon({ points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
  ),

  Vault: ({ className = '' }: IconProps = {}) => svg({ className, width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    rect({ x: 3, y: 11, width: 18, height: 11, rx: 2, ry: 2 }),
    path({ d: 'M7 11V7a5 5 0 0 1 10 0v4' })
  ),

  Report: () => svg({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    path({ d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
    polyline({ points: '14 2 14 8 20 8' }),
    line({ x1: 16, y1: 13, x2: 8, y2: 13 }),
    line({ x1: 16, y1: 17, x2: 8, y2: 17 })
  ),

  Activity: () => svg({ width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    polyline({ points: '22 12 18 12 15 21 9 3 6 12 2 12' })
  ),

  Warning: (_props: IconProps = {}) => svg({ width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3' },
    path({ d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' }),
    line({ x1: 12, y1: 9, x2: 12, y2: 13 }),
    line({ x1: 12, y1: 17, x2: 12.01, y2: 17 })
  ),

  Download: () => svg({ width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    path({ d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    polyline({ points: '7 10 12 15 17 10' }),
    line({ x1: 12, y1: 15, x2: 12, y2: 3 })
  ),

  Trash: () => svg({ width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    polyline({ points: '3 6 5 6 21 6' }),
    path({ d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' })
  ),

  Library: () => svg({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    path({ d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
    path({ d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' })
  ),

  Calendar: () => svg({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    rect({ x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 }),
    line({ x1: 16, y1: 2, x2: 16, y2: 6 }),
    line({ x1: 8, y1: 2, x2: 8, y2: 6 }),
    line({ x1: 3, y1: 10, x2: 21, y2: 10 })
  ),
};
