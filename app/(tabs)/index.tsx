// app/(tabs)/index.tsx
import { FlatList, StyleSheet, View } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { Text } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useLocalFiles } from '@/hooks/useLocalFiles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LocalFile } from '@/types/files';
import { File, FolderOpen } from 'lucide-react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { files, isLoading, importFile } = useLocalFiles();
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');

  const handleImport = async () => {
    const fileUri = await importFile();
    if (fileUri) {
      router.push({
        pathname: '/draw',
        params: {
          uri: fileUri,
        }
      })
    }
  };

  const openFile = async (file: LocalFile) => {
    router.push({
      pathname: '/draw',
      params: {
        uri: file.uri,
      }
    })
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
        <TouchableOpacity
          style={styles.importButton}
          onPress={handleImport}
        >
          <View style={styles.buttonContent}>
            <FolderOpen size={20} color={textColor} />
            <Text style={[styles.buttonText, { color: textColor }]}>
              Import PDF
            </Text>
          </View>
        </TouchableOpacity>
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
  importButton: {
    backgroundColor: '#0084ff',
    borderRadius: 8,
    padding: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
