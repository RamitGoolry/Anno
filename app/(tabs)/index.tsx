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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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
          name="delete"
          size={24}
          color="#880000"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            PDF Files
          </Text>
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
              No PDFs. Tap + to add files.
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.fabContainer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[styles.fabButton]}
          onPress={handleImport}
        >
          <MaterialCommunityIcons
            name="plus"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 48,
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
  fabContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0084ff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
