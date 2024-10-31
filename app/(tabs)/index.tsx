// app/(tabs)/index.tsx
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import { Text } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useLocalFiles } from '@/hooks/useLocalFiles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LocalFile } from '@/types/files';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { files, isLoading, importFile, deleteFile } = useLocalFiles();
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

  const handleDelete = async (file: LocalFile) => {
    Alert.alert(
      'Delete File',
      `Are you sure you want to delete ${file.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteFile(file.uri),
          style: 'destructive',
        },
      ],
    );
  };

  const renderFileItem = ({ item }: { item: LocalFile }) => (
    <View style={styles.fileItem}>
      <View style={styles.leftContent}>
        <MaterialCommunityIcons
          name="file-pdf-box"
          size={24}
          color={textColor}
        />
        <TouchableOpacity
          style={styles.fileTouchable}
          onPress={() => openFile(item)}
        >
          <View style={styles.fileInfo}>
            <Text style={[styles.fileName, { color: textColor }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.fileDate, { color: textColor }]}>
              {item.lastModified?.toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => handleDelete(item)}
        style={styles.deleteButton}
      >
        <MaterialCommunityIcons
          name="delete-outline"
          size={24}
          color="red"
        />
      </TouchableOpacity>
    </View>
  );

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
            <MaterialCommunityIcons name="folder-plus" size={24} color={textColor} />
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
  fileList: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // This pushes content to edges
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,  // Take up available space
  },
  fileTouchable: {
    flex: 1,
    marginLeft: 12,
  },
  fileInfo: {
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 4,
  },
  fileDate: {
    fontSize: 12,
    marginTop: 6,
    opacity: 0.7,
  },
  deleteButton: {
    padding: 8,
  },
});
