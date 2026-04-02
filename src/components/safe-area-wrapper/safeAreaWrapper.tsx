import React from 'react';
import { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const SafeAreaWrapper: React.FC<WrapperProps> = ({ children, style }) => {
  return (
    <SafeAreaView
      edges={['left', 'right', 'top', 'bottom']}
      style={[{ backgroundColor: 'white', flex: 1, padding: 0 }, style]}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
