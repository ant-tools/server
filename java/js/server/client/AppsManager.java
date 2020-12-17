package js.server.client;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URL;
import java.util.List;
import java.util.SortedMap;

import js.io.FilesOutputStream;
import js.io.StreamHandler;

public interface AppsManager
{
  boolean deploy(String appName, boolean synchronous, StreamHandler<OutputStream> archive) throws IOException;

  boolean undeploy(String appName, boolean synchronous) throws IOException;

  boolean uploadSamsungTvApp(String fileName, StreamHandler<OutputStream> archive) throws IOException;

  List<String> getDirtyFiles(String targetDir, SortedMap<String, byte[]> sourceFiles, boolean removeStaleFiles) throws IOException;

  void synchronize(String targetDir, StreamHandler<FilesOutputStream> filesArchive) throws IOException;
  
  void publishWidgets(StreamHandler<FilesOutputStream> filesArchive) throws IOException;

  long getFileLength(URL fileURL) throws FileNotFoundException;
}
