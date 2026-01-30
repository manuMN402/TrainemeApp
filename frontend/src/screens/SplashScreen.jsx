import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo entrance with smooth easing
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animation completes
    const timer = setTimeout(() => {
      navigation.replace("RoleSelect");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, opacityAnim, slideAnim]);

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.background} />

      {/* Animated Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              { scale: scaleAnim },
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App Title with fade-in */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: opacityAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        TraineMe
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: opacityAnim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [0, 0, 0.7],
            }),
          },
        ]}
      >
        Your Fitness Journey Starts Here
      </Animated.Text>

      {/* Animated dots loader */}
      <View style={styles.loaderContainer}>
        <DotLoader />
      </View>
    </View>
  );
}

// Animated dots loader component
function DotLoader() {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create smooth looping animation for each dot
    const createDotAnimation = (delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(null, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(null, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start smooth staggered animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Anim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dot1Anim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(150),
        Animated.timing(dot2Anim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dot2Anim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(dot3Anim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dot3Anim, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [dot1Anim, dot2Anim, dot3Anim]);

  return (
    <View style={styles.dotsContainer}>
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: dot1Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: dot2Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            opacity: dot3Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#070B1A",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#070B1A",
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#6366f1",
    letterSpacing: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#a5b4fc",
    letterSpacing: 0.5,
    marginBottom: 60,
    fontWeight: "300",
  },
  loaderContainer: {
    marginTop: 40,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6366f1",
  },
});
