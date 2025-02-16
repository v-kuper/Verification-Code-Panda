import {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import type {SharedValue} from 'react-native-reanimated';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  FlipInXDown,
  FlipOutXDown,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export type StatusType = 'inProgress' | 'correct' | 'wrong';

enum Status {
  inProgress = 'inProgress',
  correct = 'correct',
  wrong = 'wrong',
}

enum Colors {
  inProgress = '#F99417',
  correct = '#16C47F',
  wrong = '#FF1E56',
}

export type AnimatedCodeNumberProps = {
  code?: number;
  highlighted: boolean;
  status: SharedValue<StatusType>;
};

export const AnimatedCodeNumber: React.FC<AnimatedCodeNumberProps> = ({
  code,
  highlighted,
  status,
}) => {
  const getColorByStatus = useCallback(
    (vStatus: StatusType) => {
      'worklet';

      if (highlighted) return Colors.inProgress;

      if (vStatus === 'correct') {
        return Colors.correct;
      }

      if (vStatus === 'wrong') {
        return Colors.wrong;
      }

      return 'transparent';
    },
    [highlighted],
  );

  const rBoxStyle = useAnimatedStyle(() => {
    const isActive =
      status.value === Status.inProgress ||
      status.value === Status.correct ||
      status.value === Status.wrong;
    return {
      borderWidth: withTiming(isActive ? 2.3 : 0),
      borderColor: withTiming(getColorByStatus(status.value)),
    };
  }, [getColorByStatus]);

  return (
    <Animated.View style={[styles.container, rBoxStyle]}>
      {code != null && (
        <Animated.View
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(250)}>
          <Animated.Text
            entering={FlipInXDown.duration(500)
              .easing(Easing.bezier(0, 0.75, 0.5, 0.9).factory())
              .build()}
            exiting={FlipOutXDown.duration(500)
              .easing(Easing.bezier(0.6, 0.1, 0.4, 0.8).factory())
              .build()}
            style={styles.text}>
            {code}
          </Animated.Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '90%',
    width: '80%',
    borderWidth: 2,
    borderRadius: 25,
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    backgroundColor: '#EDEDED',
  },
  text: {
    color: 'black',
    fontSize: 40,
    fontFamily: 'FiraCode',
  },
});
