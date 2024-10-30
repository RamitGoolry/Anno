import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Canvas, Path } from "@shopify/react-native-skia";
import { GestureDetector } from "react-native-gesture-handler";
import { StyleSheet, View, Text } from "react-native";
import React, { useMemo } from "react";
import { ThemedView } from '../../components/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useDrawing } from "@/hooks/useDrawing";
import { Point } from "@/types/drawing";

export default function DrawScreen() {
  const { paths, gesture } = useDrawing();

  const textColor = useThemeColor({}, 'text');

  const pathToSvg = (points: Point[]) => {
    if (points.length < 1) return "";

    const d = points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    return d;
  };

  const renderedPaths = useMemo(() =>
    paths.map((path, index) => (
      <Path
        key={index}
        path={pathToSvg(path.points)}
        strokeWidth={4}
        style="stroke"
        color="#000000"
        strokeJoin="round"
        strokeCap="round"
      />
    )), [paths]);

  return (
    <ThemedView style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <GestureDetector gesture={gesture}>
          <Canvas style={{ flex: 1 }}>
            {renderedPaths}
          </Canvas>
        </GestureDetector>
        <View style={styles.indicator}>
          <Text style={{ color: textColor }}>
            Input: Any (Enabled with two fingers)
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
