import { Canvas, Path } from "@shopify/react-native-skia";
import { GestureDetector } from "react-native-gesture-handler";
import { StyleSheet, View, Text, useWindowDimensions } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ThemedView } from '../../components/ThemedView';
import { useDrawing } from "@/hooks/useDrawing";
import { Point } from "@/types/drawing";
import Pdf from 'react-native-pdf';
import { useLocalSearchParams } from "expo-router";

export default function DrawScreen() {
  const { width, height } = useWindowDimensions();
  const { paths, gesture, scale, page } = useDrawing();
  const params = useLocalSearchParams();

  if (!params.uri) {
    return (
      <ThemedView style={styles.container}>
        <Text>Please select a PDF to annotate.</Text>
      </ThemedView>
    );
  }

  const [pdfSource, setPdfSource] = useState({
    uri: params.uri as string,
    cache: true,
  });

  useEffect(() => {
    console.log('Params changed: ', params);
    setPdfSource({
      uri: params.uri as string,
      cache: true,
    });
  }, [params.uri]);

  const pathToSvg = (points: Point[]) => {
    if (points.length < 1) return "";

    const d = points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    return d;
  };

  const renderedPaths = useMemo(() =>
    paths
      .filter(path => path.page == page)
      .map((path, index) => (
        <Path
          key={index}
          path={pathToSvg(path.points)}
          strokeWidth={4}
          style="stroke"
          color="#000000"
          strokeJoin="round"
          strokeCap="round"
        />
      )), [paths, page]);

  return (
    <ThemedView style={styles.container}>
      {/* PDF Layer */}
      <View style={styles.pdfContainer}>
        <Pdf
          source={pdfSource}
          style={[styles.pdf, { width, height }]}
          page={page}
          scale={scale}
          enablePaging={true}
          onLoadComplete={(numberOfPages, _filePath) => {
            console.log(`Loaded ${numberOfPages} pages`);
          }}
          onError={(error) => {
            console.log(error);
          }}
        />
      </View>
      {/* Gesture Layer */}
      <GestureDetector gesture={gesture}>
        <Canvas style={{ flex: 1 }}>
          {renderedPaths}
        </Canvas>
      </GestureDetector>
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
  },
  pdfContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  pdf: {
    flex: 1,
  },
});
