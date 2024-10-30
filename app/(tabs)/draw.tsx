import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Canvas, Path } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { StyleSheet, View, Text, useWindowDimensions } from "react-native";
import React, { useState, useRef } from "react";
import { ThemedView } from '../../components/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';

interface Point {
  x: number;
  y: number;
}

interface DrawPath {
  points: Point[];
}

export default function DrawScreen() {
  const [paths, setPaths] = useState<DrawPath[]>([]);
  const currentPath = useRef<DrawPath | null>(null);
  const { width, height } = useWindowDimensions();

  const textColor = useThemeColor({}, 'text');

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onStart(({ x, y }) => {

      currentPath.current = {
        points: [{ x, y }],
      };

      setPaths(prev => [...prev, currentPath.current!]);
    })
    .onUpdate(({ x, y }) => {
      if (currentPath.current) {
        currentPath.current.points.push({ x, y });

        // Create a new reference to force update
        setPaths(prev => [...prev.slice(0, -1), { ...currentPath.current! }]);
      }
    })
    .onEnd(() => {
      currentPath.current = null;
    });

  const pathToSvg = (points: Point[]) => {
    if (points.length < 1) return "";

    const d = points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    return d;
  };

  return (
    <ThemedView style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <GestureDetector gesture={pan}>
          <Canvas style={{ flex: 1 }}>
            {paths.map((path, index) => (
              <Path
                key={index}
                path={pathToSvg(path.points)}
                strokeWidth={2}
                style="stroke"
                color="#000000"
                strokeJoin="round"
                strokeCap="round"
              />
            ))}
          </Canvas>
        </GestureDetector>
        <View style={styles.indicator}>
          <Text style={{ color: textColor }}>
            Input: Any
          </Text>
        </View>
      </GestureHandlerRootView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicator: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 5,
  }
});
