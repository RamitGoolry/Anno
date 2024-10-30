import { useState, useRef } from "react";
import { Gesture } from "react-native-gesture-handler";
import { Point, DrawPath } from "@/types/drawing";

export function useDrawing() {
  const [paths, setPaths] = useState<DrawPath[]>([]);
  const currentPath = useRef<DrawPath | null>(null);
  const previousPoint = useRef<Point | null>(null);

  const interpolatePoints = (start: Point, end: Point): Point[] => {
    const points: Point[] = [];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(Math.floor(distance / 2), 1);

    for (let i = 0; i <= steps; i++) {
      points.push({
        x: start.x + (dx * i) / steps,
        y: start.y + (dy * i) / steps,
      });
    }

    return points;
  }

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .maxPointers(1)
    .runOnJS(true)
    .onBegin(({ x, y }) => {
      const newPath: DrawPath = {
        points: [{ x, y }]
      };
      currentPath.current = newPath;

      setPaths(prev => [...prev, newPath]);
    })
    .onStart(({ x, y }) => {
      if (currentPath.current) {
        currentPath.current.points.push({ x, y });
        setPaths(prev => [...prev.slice(0, -1), { ...currentPath.current! }]);
      }
    })
    .onUpdate(({ x, y }) => {
      if (!currentPath.current || !previousPoint.current) {
        // If we somehow lost our references, create new ones
        const newPoint = { x, y };
        const newPath: DrawPath = {
          points: [newPoint],
        };
        currentPath.current = newPath;
        previousPoint.current = newPoint;
        setPaths(prev => [...prev, newPath]);
        return;
      }

      const currentPoint = { x, y };
      const newPoints = interpolatePoints(previousPoint.current!, currentPoint);

      currentPath.current.points.push(...newPoints);
      setPaths(prev => [...prev.slice(0, -1), { ...currentPath.current! }]);

      previousPoint.current = currentPoint;
    })
    .onEnd(() => {
      currentPath.current = null;
      previousPoint.current = null;
    });

  const clear = () => {
    setPaths([]);
  };

  const undo = () => {
    setPaths(prev => prev.slice(0, -1));
  };

  return {
    paths,
    gesture: panGesture,
    clear,
    undo,
  };
}
