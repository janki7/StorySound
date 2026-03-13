import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface SpeedControlProps {
  speed: number;
  setSpeed: (speed: number) => void;
}

const SPEED_PRESETS = [0.75, 1, 1.25, 1.5, 2];

export const SpeedControl: React.FC<SpeedControlProps> = ({ speed, setSpeed }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      {SPEED_PRESETS.map((preset) => {
        const isActive = Math.abs(speed - preset) < 0.05;
        return (
          <Pressable
            key={preset}
            onPress={() => setSpeed(preset)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: isActive ? '#F5A623' : '#242530',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: isActive ? '#0F1014' : '#B0ADA5',
              }}
            >
              {preset === 1 ? '1x' : `${preset}x`}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
