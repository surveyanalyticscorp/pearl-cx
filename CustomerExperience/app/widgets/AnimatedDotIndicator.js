import React, {useRef, useEffect} from 'react';
import {View, Animated} from 'react-native';

const AnimatedDotIndicator = ({
  color = '#1B3380',
  count = 3,
  size = 10,
  animationDuration = 400,
}) => {
  const animations = useRef(
    Array.from({length: count}, () => new Animated.Value(0.5)),
  ).current;

  useEffect(() => {
    const stagger = animationDuration / count;
    const dotAnims = animations.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * stagger),
          Animated.timing(anim, {
            toValue: 1,
            duration: animationDuration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.5,
            duration: animationDuration / 2,
            useNativeDriver: true,
          }),
          Animated.delay((count - i - 1) * stagger),
        ]),
      ),
    );
    dotAnims.forEach(a => a.start());
    return () => dotAnims.forEach(a => a.stop());
  }, []);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {animations.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            marginHorizontal: size / 2,
            transform: [{scale: anim}],
          }}
        />
      ))}
    </View>
  );
};

export default AnimatedDotIndicator;
