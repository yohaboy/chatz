import Colors from '@/constants/Colors';
import { radius, shadows, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

export function useAppTheme() {
  const { colorScheme } = useTheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  return {
    scheme,
    isDark: scheme === 'dark',
    colors,
    spacing,
    radius,
    typography,
    shadows,
  };
}
