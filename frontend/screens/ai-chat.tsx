import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager, Keyboard, Pressable, ScrollView } from 'react-native';
import { YStack, XStack, Text, Image, Button } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, MagicStar } from 'iconsax-react-native';
import { BlurView } from 'expo-blur';
import { aiService, ChatMessage, ResortRecommendation } from '../services/aiService';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { TextShimmer } from '../components/TextShimmer';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  recommendations?: ResortRecommendation[];
}

export default function AIChatScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: t('ai.welcomeMessage'),
    },
  ]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    setInputText('');
    Keyboard.dismiss();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userMsgText,
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare history for API
      const history: ChatMessage[] = messages.map(m => ({
        role: m.role,
        content: m.text
      }));

      // Call AI Service
      const response = await aiService.chat(userMsgText, history, sessionId);

      if (response.sessionId) {
        setSessionId(response.sessionId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.replyText,
        recommendations: response.recommendations,
      };

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: t('ai.errorMessage'),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isLoading]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    
    // Markdown styles
    const markdownStyles = StyleSheet.create({
      body: {
        color: isUser ? '#000000' : '#ffffff',
        fontSize: 16,
        lineHeight: 22,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      },
      heading3: {
        fontSize: 18,
        fontWeight: 'bold',
        color: isUser ? '#000000' : '#ffffff',
        marginBottom: 8,
        marginTop: 8,
      },
      strong: {
        fontWeight: 'bold',
        color: isUser ? '#000000' : '#ffffff',
      },
      paragraph: {
        marginTop: 0,
        marginBottom: 8,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      },
      list_item: {
        marginVertical: 4,
      },
      bullet_list: {
        marginBottom: 8,
      },
    });
    
    return (
      <Animated.View 
        entering={FadeInDown.duration(400).springify()}
        layout={LinearTransition.springify()}
        style={{ 
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          maxWidth: isUser ? '85%' : '100%', // Allow AI container to take full width for carousel
          marginBottom: 16,
          width: '100%',
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        <YStack
          backgroundColor={isUser ? '#22c55e' : '#2a2a2a'}
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          borderBottomLeftRadius={isUser ? 4 : 20}
          borderBottomRightRadius={isUser ? 20 : 4}
          maxWidth="85%" // Constrain text bubble width
        >
          <Markdown style={markdownStyles}>
            {item.text}
          </Markdown>
        </YStack>

        {/* Recommendations Carousel */}
        {item.recommendations && item.recommendations.length > 0 && (
          <YStack marginTop="$3" width="100%">
             <ScrollView 
               horizontal 
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={{ paddingLeft: 0, paddingRight: 32 }}
             >
               {item.recommendations.map((resort) => (
                 <Pressable
                   key={resort.id}
                   onPress={() => (navigation as any).navigate('Details', {
                     propertyId: resort.id,
                     // Pass other known details to show immediately while loading full details
                     name: resort.name,
                     location: resort.city,
                     price: resort.basePrice,
                     imageUri: resort.mainPhotoUrl,
                     rating: resort.rating
                   })}
                 >
                   <YStack 
                     width={240} 
                     backgroundColor="#1a1a1a" 
                     borderRadius={16} 
                     overflow="hidden"
                     marginRight="$3"
                     borderWidth={1}
                     borderColor="#333"
                   >
                     <Image
                       source={{ uri: resort.mainPhotoUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' }}
                       width="100%"
                       height={140}
                       resizeMode="cover"
                     />
                     <YStack padding="$3" gap="$1">
                       <Text color="#fff" fontSize={16} fontWeight="700" numberOfLines={1}>
                         {resort.name}
                       </Text>
                       <XStack alignItems="center" gap="$1">
                          <Text color="#aaa" fontSize={12}>{resort.city}</Text>
                          <Text color="#444">•</Text>
                          <MagicStar size={12} color="#fbbf24" variant="Bold" />
                          <Text color="#fbbf24" fontSize={12} fontWeight="600">{resort.rating}</Text>
                       </XStack>
                       <Text color="#22c55e" fontSize={14} fontWeight="600" marginTop="$1">
                         {resort.basePrice.toLocaleString()} ₸ <Text color="#666" fontSize={12}>{t('ai.night')}</Text>
                       </Text>
                     </YStack>
                   </YStack>
                 </Pressable>
               ))}
             </ScrollView>
          </YStack>
        )}
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#0a0a0a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <YStack paddingTop={insets.top} paddingBottom="$2" paddingHorizontal="$4" borderBottomWidth={1} borderBottomColor="#1a1a1a" backgroundColor="#0a0a0a">
          <XStack alignItems="center" justifyContent="space-between" height={44}>
            <XStack alignItems="center" gap="$2">
              <YStack backgroundColor="rgba(34, 197, 94, 0.1)" padding="$2" borderRadius={12}>
                <Text fontSize={24}>🦊</Text>
              </YStack>
              <YStack>
                <Text color="#fff" fontSize={18} fontWeight="700">{t('ai.title')}</Text>
                <Text color="#666" fontSize={12}>{t('ai.subtitle')}</Text>
              </YStack>
            </XStack>
          </XStack>
      </YStack>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        ListFooterComponent={
          isLoading ? (
            <Animated.View entering={FadeIn.duration(300)}>
              <XStack backgroundColor="#2a2a2a" paddingHorizontal="$4" paddingVertical="$3" borderRadius={20} alignSelf="flex-start" marginLeft={0} borderBottomLeftRadius={4}>
                <TextShimmer style={{ color: '#aaa', fontSize: 14 }}>{t('ai.thinking')}</TextShimmer>
              </XStack>
            </Animated.View>
          ) : null
        }
      />

      {/* Input Area */}
      <BlurView intensity={Platform.OS === 'ios' ? 20 : 100} tint="dark">
         <XStack 
           paddingHorizontal="$4" 
           paddingTop="$3" 
           paddingBottom={Math.max(insets.bottom, 16)}
           gap="$3"
           alignItems="flex-end"
           borderTopWidth={1}
           borderTopColor="rgba(255,255,255,0.05)"
         >
           <YStack flex={1} backgroundColor="#1a1a1a" borderRadius={24} borderWidth={1} borderColor="#333" minHeight={48} justifyContent="center">
             <TextInput
               value={inputText}
               onChangeText={setInputText}
               placeholder={t('ai.inputPlaceholder')}
               placeholderTextColor="#666"
               style={{
                 color: '#fff',
                 paddingHorizontal: 16,
                 paddingVertical: 12,
                 fontSize: 16,
                 maxHeight: 100,
               }}
               multiline
             />
           </YStack>
           <Pressable 
             onPress={handleSend}
             style={({ pressed }) => ({
               opacity: pressed || !inputText.trim() ? 0.7 : 1,
               transform: [{ scale: pressed ? 0.95 : 1 }]
             })}
             disabled={!inputText.trim()}
           >
             <YStack 
               width={48} 
               height={48} 
               borderRadius={24} 
               backgroundColor={inputText.trim() ? '#22c55e' : '#2a2a2a'} 
               alignItems="center" 
               justifyContent="center"
             >
               <Send size={24} color={inputText.trim() ? '#000' : '#666'} variant="Bold" />
             </YStack>
           </Pressable>
         </XStack>
      </BlurView>
    </KeyboardAvoidingView>
  );
}
