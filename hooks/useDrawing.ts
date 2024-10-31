import { useState, useRef } from "react";
import { Gesture, PointerType } from "react-native-gesture-handler";
import { Point, DrawPath } from "@/types/drawing";

function interpolatePoints(start: Point, end: Point): Point[] {
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

export function useDrawing() {
  const [paths, setPaths] = useState<DrawPath[]>([]);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const currentPath = useRef<DrawPath | null>(null);
  const previousPoint = useRef<Point | null>(null);
  const isPencil = useRef(false);

  const undo = () => {
    setPaths(prev => prev.slice(0, -1));
  };

  const twoFingerTap = Gesture.Tap()
    .minPointers(2)
    .numberOfTaps(1)
    .runOnJS(true)
    .onEnd(() => {
      undo();
    });

  const drawGesture = Gesture.Pan()
    .minDistance(0)
    .maxPointers(1)
    .runOnJS(true)
    .onBegin(({ x, y, pointerType }) => {
      if (pointerType != PointerType.STYLUS) {
        return;
      }

      const newPoint = { x, y };
      const newPath: DrawPath = {
        points: [newPoint]
      };
      currentPath.current = newPath;
      previousPoint.current = newPoint;

      setPaths(prev => [...prev, newPath]);
    })
    .onUpdate(({ x, y, pointerType }) => {
      if (pointerType != PointerType.STYLUS) {
        return;
      }

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

  const gesture = Gesture.Simultaneous(
    drawGesture,
    twoFingerTap
  );

  return {
    paths,
    gesture
  };
}
