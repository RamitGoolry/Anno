// app/(tabs)/index.tsx
import { Button, FlatList, StyleSheet, View } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { Text } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useLocalFiles } from '@/hooks/useLocalFiles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { LocalFile } from '@/types/files';
import { File, FolderOpen } from 'lucide-react';

export default function HomeScreen() {
  const { files, isLoading, importFile } = useLocalFiles();
  const navigation = useNavigation();
  const textColor = useThemeColor({}, 'text');

  const handleImport = async () => {
    const fileUri = await importFile();
    if (fileUri) {
      navigation.navigate('Draw', { uri: fileUri, cache: true });
    }
  };

  const openFile = async (file: LocalFile) => {
    navigation.navigate('Draw', { uri: file.uri, cache: true });
  };

  const renderFileItem = ({ item }: { item: LocalFile }) => {
    return (
      <TouchableOpacity
        style={styles.fileItem}
        onPress={() => openFile(item)}
      >
        <File size={24} color={textColor} />
        <View style={styles.fileInfo}>
          <Text style={[styles.fileName, { color: textColor }]}>{item.name}</Text>
          <Text style={[styles.fileDate, { color: textColor }]}>{item.lastModified?.toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    )
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          PDF Files
        </Text>
        <Button onPress={handleImport}>
          <FolderOpen size={20} className="mr-2" />
          Import PDF
        </Button>
      </View>

      {files.length > 0 ? (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={item => item.uri}
          style={styles.fileList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: textColor }]}>
            {isLoading ? 'Loading...' : 'No PDFs. Tap Import to add files.'}
          </Text>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  fileList: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
  },
  fileDate: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
