import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText, Card, CardSubtitle, CardTitle, SecondaryButton } from '@/components/ui';
import { border, palette } from '@/constants/colors';
import { radii, spacing } from '@/constants/theme';
import { loadInvestingThesis, saveInvestingThesis } from '@/lib/thesisStorage';

type ThesisSectionProps = {
  defaultThesis: string;
};

export default function ThesisSection({ defaultThesis }: ThesisSectionProps) {
  const [thesis, setThesis] = useState(defaultThesis);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadInvestingThesis(defaultThesis).then((value) => {
      setThesis(value);
      setHydrated(true);
    });
  }, [defaultThesis]);

  const handleSave = async () => {
    await saveInvestingThesis(thesis.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!hydrated) return null;

  return (
    <Card style={styles.card}>
      <CardTitle>Your Thesis</CardTitle>
      <CardSubtitle>
        Share how you evaluate startups. This appears on your scout profile.
      </CardSubtitle>

      <TextInput
        value={thesis}
        onChangeText={(text) => {
          setThesis(text);
          setSaved(false);
        }}
        placeholder="What do you look for in campus startups?"
        placeholderTextColor={palette.muted}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        style={styles.input}
      />

      <View style={styles.footer}>
        <AppText variant="caption" tone="muted">
          {thesis.trim().length} characters
        </AppText>
        <SecondaryButton
          label={saved ? 'Saved' : 'Save thesis'}
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  input: {
    marginTop: spacing.md,
    minHeight: 140,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: border.light,
    backgroundColor: palette.offWhite,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    lineHeight: 22,
    color: palette.background,
  },
  footer: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  saveButton: {
    minWidth: 120,
  },
});
