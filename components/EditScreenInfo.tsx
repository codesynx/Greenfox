import { StyleSheet, Text, View } from 'react-native';



export default function EditScreenInfo({ path }: { path: string }) {

  const title = "Open up the code for this screen:"
  const description = "Change any of the text, save the file, and your app will automatically update."

  return (
    <View style={styles.getStartedContainer}>
      <Text style={styles.getStartedText} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
      <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
        <Text numberOfLines={1} ellipsizeMode="middle">{path}</Text>
      </View>
      <Text style={styles.getStartedText} numberOfLines={3} ellipsizeMode="tail">{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  helpContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
});
