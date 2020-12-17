package js.server.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.Writer;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import js.annotation.Public;
import js.annotation.Service;
import js.core.AppContext;
import js.core.Factory;
import js.dom.Document;
import js.dom.DocumentBuilder;
import js.dom.Element;
import js.io.FilesInputStream;
import js.io.FilesIterator;
import js.lang.BugError;
import js.log.Log;
import js.log.LogFactory;
import js.server.AppsManager;
import js.server.model.AdminException;
import js.server.service.ApacheHttpd;
import js.util.Files;
import js.util.Strings;

/**
 * Implementation of application management service.
 * 
 * @author Iulian Rotaru
 * @since 1.2
 */
@Service("apps")
@Public
final class AppsManagerImpl implements AppsManager
{
  /** Class logger. */
  private static final Log log = LogFactory.getLog(AppsManager.class);

  private static final File SAMSUNG_TV_REPOSITORY = new File("/var/www/html");
  // private static final File SAMSUNG_TV_REPOSITORY = new File("fixture");

  // application name - version - region where application will be used - package date
  private static final Pattern SAMSUNG_ARCHIVE_NAME = Pattern.compile("^(.+)_(\\d{1})\\.(\\d{3})_([a-z]+)_(\\d{8})\\.zip$", Pattern.CASE_INSENSITIVE);

  /** Application archive undeploy timeout, in milliseconds. */
  private static final int UNDEPLOY_TIMEOUT = 30000;

  /** Application archive deploy timeout, in milliseconds. */
  private static final int DEPLOY_TIMEOUT = 60000;

  private final AppContext context;

  private final ApacheHttpd apache;

  private final File webapps;

  public AppsManagerImpl(AppContext context, ApacheHttpd apache)
  {
    log.trace("AppsManagerImpl(AppContext, ApacheHttpd)");
    this.context = context;
    this.apache = apache;
    this.webapps = webapps();
  }

  @Override
  public boolean deploy(String appName, boolean synchronous, InputStream archive) throws IOException
  {
    log.debug("Deploying application |%s| synchronous |%s|.", appName, synchronous);
    File archiveFile = new File(webapps, Strings.concat(appName, ".war"));
    if(archiveFile.exists()) {
      undeploy(appName, synchronous);
    }

    // deploying directly from stream may lead to a race condition
    // I'm not sure but is possible Tomcat to see archive file changed before upload completes
    File temporaryFile = Files.copy(archive);
    Files.copy(temporaryFile, archiveFile);
    temporaryFile.delete();

    File explodedDir = new File(webapps, appName);
    // if deployment is synchronous wait for exploded directory to be create, i.e. deploy complete
    if(synchronous && !Files.inotify(explodedDir, Files.FileNotify.CREATE, DEPLOY_TIMEOUT)) {
      log.warn("Timeout on application |%s| deploy.", appName);
      return false;
    }
    log.debug("Application |%s| deployed.", appName);
    return true;
  }

  @Override
  public boolean undeploy(String appName, boolean synchronous) throws IOException
  {
    log.debug("Undeploying application |%s| synchronous |%s|.", appName, synchronous);
    File archiveFile = new File(webapps, Strings.concat(appName, ".war"));
    if(!archiveFile.exists()) {
      log.warn("Application archive |%s| is not deployed. Maybe was removed manually or never installed.", archiveFile);
    }
    else {
      if(!archiveFile.delete()) {
        log.error("Unable to remove deployed application archive |%s|.", archiveFile);
        return false;
      }
    }

    File explodedDir = new File(webapps, appName);
    // if undeployment is syncrhonous wait for exploded directory to be removed, i.e. undeploy complete
    if(synchronous && !Files.inotify(explodedDir, Files.FileNotify.DELETE, UNDEPLOY_TIMEOUT)) {
      log.warn("Timeout on application |%s| undeploy.", appName);
      return false;
    }
    log.debug("Application |%s| undeployed.", appName);
    return true;
  }

  @Override
  public boolean uploadSamsungTvApp(String fileName, InputStream stream) throws IOException
  {
    Matcher matcher = SAMSUNG_ARCHIVE_NAME.matcher(fileName);
    if(!matcher.find()) {
      log.error("Invalid Samsung TV application archive name |%s|.", fileName);
      return false;
    }

    String appName = matcher.group(1);
    File[] files = SAMSUNG_TV_REPOSITORY.listFiles();
    if(files != null) {
      for(File file : files) {
        matcher = SAMSUNG_ARCHIVE_NAME.matcher(file.getName());
        if(!matcher.find()) {
          continue;
        }
        if(appName.equals(matcher.group(1))) {
          file.delete();
        }
      }
    }

    File archiveFile = new File(SAMSUNG_TV_REPOSITORY, fileName);
    Files.copy(stream, archiveFile);

    DocumentBuilder builder = Factory.getInstance(DocumentBuilder.class);
    Document configXml = null;
    ZipInputStream archive = new ZipInputStream(new FileInputStream(archiveFile));
    try {
      for(;;) {
        ZipEntry entry = archive.getNextEntry();
        if(entry == null) {
          break;
        }
        if("config.xml".equals(entry.getName())) {
          configXml = builder.loadXML(archive);
          break;
        }
      }
    }
    finally {
      Files.close(archive);
    }
    if(configXml == null) {
      log.error("Invalid Samsung TV application archive |%s|. Missing config.xml entry.", fileName);
      return false;
    }

    String appTitle = configXml.getByTag("widgetname").getText();
    String appID = appTitle.replace(' ', '_').toLowerCase();
    String appDescription = configXml.getByTag("description").getText();
    String download = "http://192.168.1.5/" + fileName;

    Document widgetListXml = null;
    File widgetListFile = new File(SAMSUNG_TV_REPOSITORY, "widgetlist.xml");
    if(!widgetListFile.exists()) {
      widgetListXml = builder.createXML("rsp");
      Element root = widgetListXml.getRoot();
      root.setAttr("stat", "ok");
      root.addChild(widgetListXml.createElement("list"));
    }
    else {
      widgetListXml = builder.loadXML(widgetListFile);
    }
    assert widgetListXml != null;

    Element widget = widgetListXml.getByXPath("//list/widget[@id='%s']", appID);
    if(widget == null) {
      widget = widgetListXml.createElement("widget", "id", appID);
      widget.addChild(widgetListXml.createElement("title").setText(appTitle));
      widget.addChild(widgetListXml.createElement("description").setText(appDescription));
      widget.addChild(widgetListXml.createElement("compression", "size", Long.toString(archiveFile.length()), "type", "zip"));
      widget.addChild(widgetListXml.createElement("download").setText(download));

      widgetListXml.getByTag("list").addChild(widget);
    }
    else {
      widget.getByTag("title").setText(appTitle);
      widget.getByTag("description").setText(appDescription);
      widget.getByTag("compression").setAttr("size", Long.toString(archiveFile.length()));
      widget.getByTag("download").setText(download);
    }

    Writer writer = new FileWriter(widgetListFile);
    try {
      widgetListXml.serialize(writer);
    }
    finally {
      Files.close(writer);
    }

    log.debug("Samsung TV application |%s| uploaded.", fileName);
    return true;
  }

  @Override
  public List<String> getDirtyFiles(String targetDir, SortedMap<String, byte[]> sourceFiles, boolean removeStaleFiles) throws IOException
  {
    String docRoot = this.apache.getFile(targetDir).getPath();
    List<String> dirtyFiles = new ArrayList<String>();

    SortedMap<String, byte[]> targetFiles = new TreeMap<String, byte[]>();
    for(String file : FilesIterator.getRelativeNamesIterator(docRoot)) {
      targetFiles.put(Files.path2unix(file), Files.getFileDigest(new File(docRoot, file)));
    }

    Iterator<Map.Entry<String, byte[]>> sourceFilesIterator = sourceFiles.entrySet().iterator();
    Iterator<Map.Entry<String, byte[]>> targetFilesIterator = targetFiles.entrySet().iterator();

    SOURCE_FILES_LOOP: while(sourceFilesIterator.hasNext()) {
      if(!targetFilesIterator.hasNext()) {
        break;
      }
      Map.Entry<String, byte[]> sourceFileEntry = sourceFilesIterator.next();
      Map.Entry<String, byte[]> targetFileEntry = targetFilesIterator.next();

      if(sourceFileEntry.getKey().equals(targetFileEntry.getKey())) {
        // here files are equals; check file digest to see if changed
        addDirtyFile(dirtyFiles, sourceFileEntry, targetFileEntry);
        continue;
      }

      // source and target iterators synchronization is lost; attempt to regain it

      // remove target file by file till found one existing into source files or end of target files
      while(!sourceFiles.containsKey(targetFileEntry.getKey())) {
        if(removeStaleFiles) {
          // target file is not present on source and need to be erased
          deleteTargetFile(docRoot, targetFileEntry);
        }
        if(!targetFilesIterator.hasNext()) {
          break SOURCE_FILES_LOOP;
        }
        targetFileEntry = targetFilesIterator.next();
      }

      // here we know the target file is present into sources
      // add sources file by file until reach the target
      for(;;) {
        if(sourceFileEntry.getKey().equals(targetFileEntry.getKey())) {
          // here source and target files are equals; check file digest to see if changed
          addDirtyFile(dirtyFiles, sourceFileEntry, targetFileEntry);
          continue SOURCE_FILES_LOOP;
        }
        addDirtyFile(dirtyFiles, sourceFileEntry);
        if(!sourceFilesIterator.hasNext()) {
          break SOURCE_FILES_LOOP;
        }
        sourceFileEntry = sourceFilesIterator.next();
      }
    }

    // if there are more unprocessed source files just add to dirty files list
    while(sourceFilesIterator.hasNext()) {
      addDirtyFile(dirtyFiles, sourceFilesIterator.next());
    }

    // if there are more unprocessed target files remove them
    if(removeStaleFiles) {
      while(targetFilesIterator.hasNext()) {
        deleteTargetFile(docRoot, targetFilesIterator.next());
      }
    }

    return dirtyFiles;
  }

  private void deleteTargetFile(String targetDir, Map.Entry<String, byte[]> targetFileEntry)
  {
    File targetFile = new File(targetDir, targetFileEntry.getKey());
    if(!targetFile.delete()) {
      badFilesArchive("Fail to delete target file |%s|.", targetFile.getAbsolutePath());
    }
    else {
      log.trace("Remove target file |%s|.", targetFile.getAbsoluteFile());
    }
  }

  private static void addDirtyFile(List<String> dirtyFiles, Map.Entry<String, byte[]> sourceFileEntry)
  {
    dirtyFiles.add(sourceFileEntry.getKey());
    // log.trace("Add dirty file |%s|.", sourceFileEntry.getKey());
    System.out.printf("Add dirty file |%s|.\r\n", sourceFileEntry.getKey());
  }

  private static void addDirtyFile(List<String> dirtyFiles, Map.Entry<String, byte[]> sourceFileEntry, Map.Entry<String, byte[]> targetFileEntry)
  {
    if(!Arrays.equals(sourceFileEntry.getValue(), targetFileEntry.getValue())) {
      addDirtyFile(dirtyFiles, sourceFileEntry);
    }
  }

  @Override
  public void synchronize(String targetDir, FilesInputStream files) throws IOException
  {
    File docRoot = this.apache.getFile(targetDir);
    if(!docRoot.exists()) {
      badFilesArchive("Target directory |%s| does not exist.", docRoot);
    }
    if(!docRoot.isDirectory()) {
      badFilesArchive("Target directory |%s| is a regular file.", docRoot);
    }
    log.debug("Synchronize files archive on target directory |%s|.", docRoot);

    for(File file : files) {
      File targetFile = new File(docRoot, file.getPath());
      log.trace("Synchronize file |%s|.", targetFile);
      if(targetFile.exists()) {
        if(!targetFile.delete()) {
          badFilesArchive("Fail to delete target file |%s|.", targetFile.getAbsolutePath());
        }
      }
      Files.mkdirs(targetFile);
      files.copy(targetFile);
    }
  }

  private static final String WIDGETS_DIR = "js-lib.com/libraries";
  private static final String LIBRARIES_LIST = "libraries-list";

  @Override
  public void publishWidgets(FilesInputStream files) throws IOException
  {
    synchronize(WIDGETS_DIR, files);

    File widgetsDir = apache.getFile(WIDGETS_DIR);
    List<File> widgetFiles = Arrays.asList(widgetsDir.listFiles(new FilenameFilter()
    {
      @Override
      public boolean accept(File dir, String name)
      {
        return name.endsWith(".zip");
      }
    }));
    Collections.sort(widgetFiles);

    File librariesList = new File(widgetsDir, LIBRARIES_LIST);
    PrintWriter librariesListWriter = new PrintWriter(new FileWriter(librariesList));
    for(File widgetFile : widgetFiles) {
      librariesListWriter.println(widgetFile.getName());
    }
    librariesListWriter.close();
  }

  private void badFilesArchive(String message, Object... args) throws AdminException
  {
    throw new AdminException("Fail to process files archive uploaded from |%s|. %s", context.getRemoteAddr(), String.format(message, args));
  }

  @Override
  public long getFileLength(URL fileURL) throws FileNotFoundException
  {
    // assume document root naming convention: uses URL host name as virtual host directory
    File file = new File(apache.getFile(fileURL.getHost()), fileURL.getPath());
    if(!file.exists()) {
      throw new FileNotFoundException(file.getAbsolutePath());
    }
    return file.length();
  }

  private static File webapps()
  {
    final String SERVER_BASE = "catalina.base";

    String serverBaseProperty = System.getProperty(SERVER_BASE);
    if(serverBaseProperty == null) {
      throw new BugError("Invalid environment: missing ${%s} system property. Server startup abort.", SERVER_BASE);
    }
    File serverBase = new File(serverBaseProperty);
    if(!serverBase.exists()) {
      throw new BugError("Invalid environment: bad ${%s} system property. Web server directory |%s| does not exist. Server startup abort.", SERVER_BASE, serverBase);
    }
    return new File(serverBase, "webapps");
  }
}
