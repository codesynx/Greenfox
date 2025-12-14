import { ScrollView, Pressable } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { useTranslation } from 'react-i18next';

interface CategoryListProps {
  categories: string[];
  activeCategory: string;
  onCategoryPress: (category: string) => void;
}

export const CategoryList = ({ categories, activeCategory, onCategoryPress }: CategoryListProps) => {
  const { t } = useTranslation();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
      <XStack gap="$3">
        {categories.map((category) => (
          <Pressable key={category} onPress={() => onCategoryPress(category)}>
            <YStack
              paddingHorizontal="$5"
              paddingVertical="$2.5"
              borderRadius={999}
              backgroundColor={activeCategory === category ? '#22c55e' : 'rgba(255, 255, 255, 0.08)'}
              borderWidth={1}
              borderColor={activeCategory === category ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}
            >
              <Text
                fontSize={15}
                fontWeight="600"
                color={activeCategory === category ? 'white' : 'rgba(255, 255, 255, 0.7)'}
              >
                {t(`home.categories.${category}`)}
              </Text>
            </YStack>
          </Pressable>
        ))}
      </XStack>
    </ScrollView>
  );
};
