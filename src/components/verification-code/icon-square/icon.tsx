import React, {forwardRef, useImperativeHandle} from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';
import type {AnimateStyle, SharedValue} from 'react-native-reanimated';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {Canvas, Path} from '@shopify/react-native-skia';

import {useIconPaths} from './useIconPaths';
import {Eye} from './eye';
import {
  EarsPath,
  FacePath,
  LeftEyePath,
  NosePath,
  RightEyePath,
} from './constants.ts';

// Define the props for the InternalIcon component
type InternalIconProps = {
  style: AnimateStyle<ViewStyle>;
  progress: SharedValue<number>;
};

// Define the ref methods for the InternalIcon component
export type InternalIconRef = {
  happy: () => void;
  sad: () => void;
  normal: () => void;
};

// Constants for the eyebrow and mouth canvas sizes and stroke widths
const MOUTH_CANVAS_SIZE = {width: 25, height: 20};
const MOUTH_STROKE_WIDTH = 2.5;
const PROGRESS_INPUT_RANGE = [0, 1];
const GAP_OUTPUT_RANGE = [33, 30];
const C_WIDTH = 121;
const C_HEIGHT = 108;

// InternalIcon component that uses forwardRef to expose methods to its parent
export const InternalIcon = forwardRef<InternalIconRef, InternalIconProps>(
  ({style, progress}, ref) => {
    // Get the icon paths and methods from the useIconPaths hook
    const {mouthPath, happy, sad, normal} = useIconPaths();

    // Expose the happy, sad, and normal methods to the parent component
    useImperativeHandle(ref, () => ({
      happy,
      sad,
      normal,
    }));

    // Animated style for the gap between elements
    const animatedGap = useAnimatedStyle(() => ({
      gap: interpolate(progress.value, PROGRESS_INPUT_RANGE, GAP_OUTPUT_RANGE),
    }));

    // Animated style for the eyes
    const animatedEyeStyle = useAnimatedStyle(() => ({
      position: 'absolute',
      flexDirection: 'row' as const,
      gap: interpolate(progress.value, PROGRESS_INPUT_RANGE, GAP_OUTPUT_RANGE),
    }));

    return (
      <Animated.View style={[style, animatedGap, styles.container]}>
        <Canvas style={{height: C_HEIGHT, width: C_WIDTH}}>
          <Path path={EarsPath} color="black" />
          <Path path={FacePath} color="white" />
          <Path path={NosePath} color="black" />
          <Path path={RightEyePath} color="black" />
          <Path path={LeftEyePath} color="black" />
        </Canvas>
        {/* Render the eyes */}
        <Animated.View style={animatedEyeStyle}>
          <Eye progress={progress} />
          <Eye progress={progress} />
        </Animated.View>
        {/*/!* Render the mouth *!/*/}
        <View style={styles.mouth}>
          <Canvas style={MOUTH_CANVAS_SIZE}>
            <Path
              path={mouthPath}
              color="black"
              style="stroke"
              strokeWidth={MOUTH_STROKE_WIDTH}
              strokeCap="round"
            />
          </Canvas>
        </View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mouth: {
    position: 'absolute',
    bottom: 15,
  },
});
