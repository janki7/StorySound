import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useSettings } from '../contexts/SettingsContext';
import { OnboardingSlide } from '../components/OnboardingSlide';

const HAS_ONBOARDED_KEY = 'storysound.hasOnboarded';

export default function OnboardingScreen() {
  const { colors } = useSettings();
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const width = Dimensions.get('window').width;

  const complete = async () => {
    await AsyncStorage.setItem(HAS_ONBOARDED_KEY, 'true');
    router.replace('/(tabs)');
  };

  const next = () => {
    if (index >= 2) {
      complete();
    } else {
      setIndex((v) => v + 1);
    }
  };

  const skip = () => complete();

  const slides = [
    {
      title: 'Import any book',
      description:
        'Listen to your stories from PDF, EPUB, or plain text. Got Kindle books? Convert them to EPUB with Calibre first.',
      illustration: '📚',
    },
    {
      title: 'Choose your voice',
      description:
        'Pick from system voices, adjust the speed, and make StorySound match your personal style.',
      illustration: '🎙️',
    },
    {
      title: 'Press play and listen',
      description:
        'Relax while StorySound reads aloud, highlighting each word as you follow along.',
      illustration: '🎧',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: index * width, y: 0 }}
      >
        {slides.map((slide, i) => (
          <View key={slide.title} style={{ width }}>
            <OnboardingSlide
              title={slide.title}
              description={slide.description}
              illustration={slide.illustration}
              isLast={i === slides.length - 1}
              onNext={next}
              onSkip={skip}
              colors={colors}
            />
          </View>
        ))}
      </ScrollView>

      {/* Dots indicator */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {slides.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === index ? colors.accent : colors.surfaceAlt2,
            }}
          />
        ))}
      </View>
    </View>
  );
}
