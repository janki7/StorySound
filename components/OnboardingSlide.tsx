import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface OnboardingSlideProps {
  title: string;
  description: string;
  illustration?: string;
  isLast?: boolean;
  onNext: () => void;
  onSkip?: () => void;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  illustration,
  isLast,
  onNext,
  onSkip,
}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        backgroundColor: '#0F1014',
      }}
    >
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: 'rgba(245,166,35,0.12)',
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
          color: '#F0EFE9',
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
          color: '#6B6866',
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
          backgroundColor: '#F5A623',
          paddingVertical: 16,
          elevation: 8,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '700',
            color: '#0F1014',
          }}
        >
          {isLast ? 'Get Started' : 'Next'}
        </Text>
      </Pressable>
      {onSkip && !isLast && (
        <Pressable onPress={onSkip} style={{ marginTop: 16, padding: 12 }}>
          <Text style={{ fontSize: 14, color: '#6B6866', textAlign: 'center' }}>Skip</Text>
        </Pressable>
      )}
    </View>
  );
};
