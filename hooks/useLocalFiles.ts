import { LocalFile } from "@/types/files";
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

export function useLocalFiles() {
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const appDocumentsPath = RNFS.DocumentDirectoryPath;
  const pdfFolderPath = `${appDocumentsPath}/pdfs`;

  // Ensure the PDF folder exists
  useEffect(() => {
    RNFS.mkdir(pdfFolderPath).catch(console.error);
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const items = await RNFS.readDir(pdfFolderPath);
      const pdfFiles = items.map(item => ({
        name: item.name,
        uri: item.path,
        lastModified: item.mtime,
      }));
      setFiles(pdfFiles);
    } catch (error) {
      console.error('Error loading files: ', error);
    } finally {
      setIsLoading(false);
    }
  }

  const importFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      const file = result[0];
      const destination = `${pdfFolderPath}/${file.name}`;

      await RNFS.copyFile(file.uri, destination);
      await loadFiles();
      return destination;
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error importing file: ', error);
        Alert.alert('Error', 'Failed to import file');
      }
      return null;
    }
  }

  const deleteFile = async (uri: string) => {
    try {
      await RNFS.unlink(uri);
      await loadFiles();
    } catch (error) {
      console.error('Error deleting file: ', error);
      Alert.alert('Error', 'Failed to delete file');
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return {
    files,
    isLoading,
    importFile,
    deleteFile,
  };
}
