import { Text, TextProps, TextStyle } from 'react-native';

import { palette, text as textColors } from '@/constants/colors';
import { TypographyVariant, typography } from '@/constants/theme';

export type TextTone =
  | 'default'
  | 'muted'
  | 'inverse'
  | 'inverseMuted'
  | 'accent'
  | 'success'
  | 'warning'
  | 'risk';

type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  tone?: TextTone;
};

const toneColors: Record<TextTone, string> = {
  default: textColors.primary,
  muted: textColors.muted,
  inverse: textColors.inverse,
  inverseMuted: textColors.inverseMuted,
  accent: palette.accent,
  success: palette.success,
  warning: palette.warning,
  risk: palette.risk,
};

export default function AppText({
  variant = 'body',
  tone = 'default',
  style,
  ...props
}: AppTextProps) {
  const variantStyle = typography[variant] as TextStyle;

  return (
    <Text
      style={[variantStyle, { color: toneColors[tone] }, style]}
      {...props}
    />
  );
}
