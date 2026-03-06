import { MD3LightTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#2D6A4F',      
  secondary: '#52B788',    
  accent: '#B7E4C7',      
  background: '#F0FAF4',    
  surface: '#FFFFFF',
  text: '#1B4332',
  textLight: '#74C69D',
  error: '#D62828',
  warning: '#F4A261',
  star: '#F4C542',
  cardBg: '#D8F3DC',
  border: '#95D5B2',
  white: '#FFFFFF',
  darkText: '#081C15',
};


export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
    onPrimary: COLORS.white,
    onSurface: COLORS.text,
  },
};


export const globalStyles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenPadding: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  input: {
    backgroundColor: COLORS.surface,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
};