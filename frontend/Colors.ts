/**
 * App-wide color palette for light and dark themes.
 * Use these constants throughout your app for consistency.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#ffffff';

export const Colors = {
  light: {
    text: '#11181C',            // Primary text color
    background: '#ffffff',      // App background
    tint: tintColorLight,       // Accent color
    icon: '#687076',            // Inactive icon color
    tabIconDefault: '#687076',  // Default tab icon color
    tabIconSelected: tintColorLight, // Selected tab icon color
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
