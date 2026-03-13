import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { ThemeColors } from '../constants/theme';

interface OnboardingSlideProps {
  title: string;
  description: string;
  illustration?: string;
  isLast?: boolean;
  onNext: () => void;
  onSkip?: () => void;
  colors: ThemeColors;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  illustration,
  isLast,
  onNext,
  onSkip,
  colors,
}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: colors.accentBgSubtle,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <Text style={{ fontSize: 44 }}>{illustration}</Text>
      </View>
      <Text
        style={{
          fontSize: 26,
          fontWeight: '800',
          color: colors.textPrimary,
          textAlign: 'center',
          marginBottom: 12,
          letterSpacing: -0.3,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 23,
          marginBottom: 40,
          maxWidth: 300,
        }}
      >
        {description}
      </Text>
      <Pressable
        onPress={onNext}
        style={{
          width: '100%',
          maxWidth: 300,
          borderRadius: 28,
          backgroundColor: colors.accent,
          paddingVertical: 16,
          elevation: 8,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '700',
            color: colors.accentOnAccent,
          }}
        >
          {isLast ? 'Get Started' : 'Next'}
        </Text>
      </Pressable>
      {onSkip && !isLast && (
        <Pressable onPress={onSkip} style={{ marginTop: 16, padding: 12 }}>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>Skip</Text>
        </Pressable>
      )}
    </View>
  );
};
