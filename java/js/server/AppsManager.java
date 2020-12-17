package js.server;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;
import java.util.SortedMap;

import js.io.FilesInputStream;

import com.sun.xml.internal.ws.api.policy.PolicyResolver.ServerContext;

/**
 * Services for application management, like deployment control and libraries updates - experimental.
 * <p>
 * <b>Security warning</b>: this service is under experimental development. For now is public and it does really expose
 * the server to attacks.
 * <p>
 * Server power by j(s)-lib should declare application manager in order to enable it. It is not enabled by default.
 * 
 * <pre>
 * &lt;VirtualHost *:80&gt;
 *     ServerName bbnet.ro
 *     ProxyPassMatch ^(?:http\://[^/])?/js-admin/(.*\.(?:xsp|rmi))$ ajp://localhost:8009/js-admin/$1
 * &lt;/VirtualHost&gt;
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.2
 */
public interface AppsManager
{
  /**
   * Deploy application identified by given API key. This method expect a WAR stream and execute a raw copy into server
   * deployment directory. There is no attempt to validate stream content; it is caller responsibility to ensure given
   * stream is indeed a well formed web application archive. Anyway, there is no harm if <code>archive</code> is
   * invalid. Server simply ignores it.
   * <p>
   * This method copy <code>archive</code> and return true. Nevertheless, if <code>synchronous</code> flag is true this
   * method waits for server deployment completion and returns false if timeout occurs.
   * 
   * @param appName application name,
   * @param synchronous flag for synchronous execution, if true waits for deployment completion,
   * @param archive web application archive.
   * @return true if application archive deploy completes successfully.
   * @throws IOException if reading from socket stream or writing application archive fails.
   */
  boolean deploy(String appName, boolean synchronous, InputStream archive) throws IOException;

  /**
   * Undeploy J2EE web application with given name. Remove web application archive from
   * {@link ServerContext#getAppBasePath()}; application server will do the rest.
   * 
   * @param apikey project API key,
   * @param synchronous flag for synchronous execution, if true waits for undeployment completion.
   * @return true if application archive undeploy completes successfully.
   * @throws IOException if archive file remove operation fails.
   */
  boolean undeploy(String appName, boolean synchronous) throws IOException;

  boolean uploadSamsungTvApp(String fileName, InputStream archive) throws IOException;

  /**
   * Get files to be updated on target directory, compared with given source files, and remove obsolete (staled) target
   * files. Create a hash map for all files from target directory, similar to given source files hash map then compare
   * these hash maps using next rules:
   * <ul>
   * <li>If file name is present on both hash maps consider it dirty if source and target files have not the same
   * message digest.
   * <li>If file exists only on source files consider it dirty.
   * <li>If file exists only on target files consider it stale and remove it.
   * </ul>
   * Files hash map, both sources and targets have the same structure: relative file path is used as hash key and file
   * content digest is the value. Note that this method expect file path to be Unix like, i.e. uses slash as separator.
   * <h5>Remove State File</h5>
   * <p>
   * If parameter <code>removeStaleFiles</code> is true, all descendant files from target directory that are not present
   * into <code>sourceFiles</code> map are permanently removed. Depending on usage pattern, this may be potentially
   * harmful for which reason removing stale files is optional.
   * 
   * @param targetDir target directory,
   * @param sourceFiles source files hash map,
   * @param removeStaleFiles remove state files, potential harmful, see description.
   * @return dirty files list.
   * @throws IOException if target directory scanning fails.
   */
  List<String> getDirtyFiles(String targetDir, SortedMap<String, byte[]> sourceFiles, boolean removeStaleFiles) throws IOException;

  /**
   * Synchronize files archive for application identified by given API key.
   * 
   * @param apikey project API key,
   * @param files files archive.
   * @throws IOException if read from socket stream or writing on target directory fails.
   */
  void synchronize(String targetDir, FilesInputStream files) throws IOException;

  void publishWidgets(FilesInputStream files) throws IOException;

  /**
   * Returns the length of the file designated by given URL. This method is a work around for chunked downloads when
   * client needs in advance the size of the file, perhaps for progress monitoring.
   * 
   * @param fileURL desired file URL.
   * @return requested file length.
   * @throws FileNotFoundException if file not found.
   */
  long getFileLength(URL fileURL) throws FileNotFoundException;
}
