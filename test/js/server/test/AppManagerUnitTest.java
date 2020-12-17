package js.server.test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import js.core.Factory;
import js.io.FilesInputStream;
import js.io.FilesIterator;
import js.io.FilesOutputStream;
import js.lang.VarArgs;
import js.server.AppsManager;
import js.server.model.AdminException;
import js.server.model.ApiKeyException;
import js.servlet.RequestContext;
import js.unit.HttpServletRequestStub;
import js.unit.TestContext;
import js.util.Classes;
import js.util.Files;
import js.util.Strings;
import junit.framework.TestCase;

public class AppManagerUnitTest extends TestCase
{
  @Override
  protected void setUp() throws Exception
  {
    TestContext.start(new File("test/js/server/test/test-config.xml"));

    RequestContext context = Factory.getInstance(RequestContext.class);
    Classes.setFieldValue(context, "httpRequest", new MockHttpRequest());

    System.setProperty("server.doc.root", "fixture");
  }

  public void testSamsungTvAppNamePattern()
  {
    Class<?> appsManagerClass = Classes.forName("js.server.impl.AppsManagerImpl");
    Pattern pattern = Classes.getFieldValue(appsManagerClass, "SAMSUNG_ARCHIVE_NAME");
    System.out.println(pattern);
    Matcher matcher = pattern.matcher("kids_fables_1.016_Europe_20151221.zip");
    assertTrue(matcher.find());
    assertEquals("kids_fables", matcher.group(1));
    assertEquals("1", matcher.group(2));
    assertEquals("016", matcher.group(3));
    assertEquals("Europe", matcher.group(4));
    assertEquals("20151221", matcher.group(5));
  }

  public void testUploadSamsungTvApp() throws IOException
  {
    String fileName = "kids_fables_1.016_Europe_20151221.zip";
    InputStream archive = new FileInputStream(new File("fixture/build/" + fileName));

    AppsManager manager = Factory.getInstance(AppsManager.class);
    manager.uploadSamsungTvApp(fileName, archive);
  }

  public void testGetDirtyFilesOnEmptyDir() throws IOException, ApiKeyException
  {
    final String sourceDir = "fixture/sources";
    final String targetDir = "empty.dir";
    final SortedMap<String, byte[]> sourceFiles = getSourceFiles(sourceDir);

    AppsManager manager = Factory.getInstance(AppsManager.class);
    List<String> dirtyFiles = manager.getDirtyFiles(targetDir, sourceFiles, false);
    assertEquals(4, dirtyFiles.size());
    assertEquals("js/admin/test/file-long-name.htm", dirtyFiles.get(0));
    assertEquals("js/admin/test/file1", dirtyFiles.get(1));
    assertEquals("js/admin/test/file7", dirtyFiles.get(2));
    assertEquals("js/admin/test/file8", dirtyFiles.get(3));
  }

  public void testGetEmptyDirtyFiles() throws IOException, ApiKeyException
  {
    final String sourceDir = "fixture/sources";
    final String targetDir = "comp.prj";
    final SortedMap<String, byte[]> sourceFiles = getSourceFiles(sourceDir);

    AppsManager manager = Factory.getInstance(AppsManager.class);
    List<String> dirtyFiles = manager.getDirtyFiles(targetDir, sourceFiles, false);
    assertEquals(0, dirtyFiles.size());
  }

  public void testGetDirtyFilesOnChangedContent() throws IOException, ApiKeyException, InterruptedException
  {
    final String sourceDir = "fixture/sources";
    final String targetDir = "target.dir";
    final SortedMap<String, byte[]> sourceFiles = getSourceFiles(sourceDir);

    Strings.save("file1", new File("fixture/target.dir/js/admin/test/file1"));
    Strings.save("file77", new File("fixture/target.dir/js/admin/test/file7"));
    Strings.save("file8", new File("fixture/target.dir/js/admin/test/file8"));

    // wait a little before changing source file1 last modified time to be sure we have a difference
    Thread.sleep(100);

    // although file1 last modified date is updated it is not considered dirty since it has the same content
    File file1 = new File("fixture/sources/js/admin/test/file1");
    assertTrue(file1.exists());
    file1.setLastModified(System.currentTimeMillis());

    AppsManager manager = Factory.getInstance(AppsManager.class);
    List<String> dirtyFiles = manager.getDirtyFiles(targetDir, sourceFiles, false);
    assertEquals(1, dirtyFiles.size());
    // file7 is included because has changed content
    assertEquals("js/admin/test/file7", dirtyFiles.get(0));
  }

  /**
   * Target directory is updated with files not existing on source directory. After dirty files preparation obsoleted
   * targets are removed. An this test case source files are [1, 7, 8] and target files [1, 4, 5, 6, 7, 8]. Sources and
   * related targets content is the same. After test exercise target [4, 5, 6] are removed and resulting dirty files
   * list is empty because there is no file to send from source to target.
   * 
   * @throws ApiKeyException
   */
  public void testGetDirtyFilesOnUpdatedTarget() throws IOException, ApiKeyException
  {
    final String sourceDir = "fixture/sources";
    final String targetDir = "updated.target";
    final SortedMap<String, byte[]> sourceFiles = getSourceFiles(sourceDir);

    Strings.save("file-long-name.htm", new File("fixture/updated.target/js/admin/test/file-long-name.htm"));
    Strings.save("file1", new File("fixture/updated.target/js/admin/test/file1"));
    Strings.save("file7", new File("fixture/updated.target/js/admin/test/file7"));
    Strings.save("file8", new File("fixture/updated.target/js/admin/test/file8"));

    for(int i = 4; i < 7; ++i) {
      File newFile = new File("fixture/updated.target/js/admin/test", "file" + i);
      newFile.createNewFile();
    }

    AppsManager manager = Factory.getInstance(AppsManager.class);
    List<String> dirtyFiles = manager.getDirtyFiles(targetDir, sourceFiles, false);
    assertEquals(0, dirtyFiles.size());

    assertTrue(new File("fixture/updated.target/js/admin/test/file1").exists());
    assertTrue(new File("fixture/updated.target/js/admin/test/file7").exists());
    assertTrue(new File("fixture/updated.target/js/admin/test/file8").exists());

    assertFalse(new File("fixture/updated.target/js/admin/test/file4").exists());
    assertFalse(new File("fixture/updated.target/js/admin/test/file5").exists());
    assertFalse(new File("fixture/updated.target/js/admin/test/file6").exists());
  }

  public void testGetDirtyFilesOnUpdatedSourcesAndTarget() throws IOException, ApiKeyException
  {
    final String sourceDir = "fixture/updated.sources";
    final String targetDir = "updated.target";
    final SortedMap<String, byte[]> sourceFiles = getSourceFiles(sourceDir);

    for(int i = 4; i < 7; ++i) {
      File newFile = new File("fixture/updated.target/js/admin/test", "file" + i);
      newFile.createNewFile();
    }

    AppsManager manager = Factory.getInstance(AppsManager.class);
    List<String> dirtyFiles = manager.getDirtyFiles(targetDir, sourceFiles, false);
    assertEquals(3, dirtyFiles.size());
    assertEquals("js/admin/test/file2", dirtyFiles.get(0));
    assertEquals("js/admin/test/file3", dirtyFiles.get(1));
    assertEquals("js/admin/test/file9", dirtyFiles.get(2));
  }

  public void testGetDirtyFilesOnUpdatedSources() throws IOException, ApiKeyException
  {
    final String sourceDir = "fixture/updated.sources";
    final String targetDir = "target.dir";
    final SortedMap<String, byte[]> sourceFiles = getSourceFiles(sourceDir);

    AppsManager manager = Factory.getInstance(AppsManager.class);
    List<String> dirtyFiles = manager.getDirtyFiles(targetDir, sourceFiles, false);
    assertEquals(4, dirtyFiles.size());
    assertEquals("js/admin/test/file2", dirtyFiles.get(0));
    assertEquals("js/admin/test/file3", dirtyFiles.get(1));
    assertEquals("js/admin/test/file7", dirtyFiles.get(2));
    assertEquals("js/admin/test/file9", dirtyFiles.get(3));
  }

  public void testGetDirtyFilesOnSingleMissingFile() throws FileNotFoundException, IOException
  {
    final String sourceDir = "fixture/single.file";
    final String targetDir = "empty.dir";
    final SortedMap<String, byte[]> sourceFiles = getSourceFiles(sourceDir);

    AppsManager manager = Factory.getInstance(AppsManager.class);
    List<String> dirtyFiles = manager.getDirtyFiles(targetDir, sourceFiles, false);
    assertEquals(1, dirtyFiles.size());
    assertEquals("file", dirtyFiles.get(0));
  }

  public void testGetDirtyFilesOnSingleMissingZipFile() throws FileNotFoundException, IOException
  {
    final String sourceDir = "fixture/single.zip";
    final String targetDir = "js-lib.com/libraries";
    final SortedMap<String, byte[]> sourceFiles = getSourceFiles(sourceDir);

    AppsManager manager = Factory.getInstance(AppsManager.class);
    List<String> dirtyFiles = manager.getDirtyFiles(targetDir, sourceFiles, false);
    assertEquals(1, dirtyFiles.size());
    assertEquals("js-lib.zip", dirtyFiles.get(0));
  }

  public void testBadFilesArchiveExceptionHelper() throws Throwable
  {
    Class<? extends AppsManager> managerClass = Classes.forName("js.server.impl.AppsManagerImpl");
    try {
      File baseDir = new File("/fake/directory");
      Classes.invoke(managerClass, "badFilesArchive", "Bad |%s|.", new VarArgs<Object>(baseDir.getAbsolutePath()));
    }
    catch(AdminException e) {
      assertEquals("Fail to process files archive uploaded from |localhost|. Bad |D:\\fake\\directory|.", e.getMessage());
      return;
    }
    fail("Bad files archive should rise admin exception.");
  }

  public void testSynchronize() throws IOException, ApiKeyException
  {
    exerciseSynchronize("comp.prj", new Callback()
    {
      @Override
      public void handle(FilesOutputStream files) throws IOException
      {
        files.addFiles(new File("fixture/sources"));
      }
    });
  }

  public void testNotExistingBaseDir() throws IOException, ApiKeyException
  {
    try {
      exerciseSynchronize("fake.target", new Callback()
      {
        @Override
        public void handle(FilesOutputStream files) throws IOException
        {
        }
      });
    }
    catch(AdminException e) {
      TestCase.assertEquals("Fail to process files archive uploaded from |localhost|. Target directory |fixture\\fake.target| does not exist.", e.getMessage());
      return;
    }
    fail("Not existing base directory should rise admin exception.");
  }

  public void testBaseDirIsFile() throws Throwable
  {
    try {
      exerciseSynchronize("sources/js/admin/test/file1", new Callback()
      {
        @Override
        public void handle(FilesOutputStream files) throws IOException
        {
        }
      });
    }
    catch(AdminException e) {
      TestCase.assertEquals("Fail to process files archive uploaded from |localhost|. Target directory |fixture\\sources\\js\\admin\\test\\file1| is a regular file.", e.getMessage());
      return;
    }
    fail("Base directory is a file should rise admin exception.");
  }

  private void exerciseSynchronize(String targetDir, Callback callback) throws IOException, ApiKeyException
  {
    final ByteArrayOutputStream bytes = new ByteArrayOutputStream();
    final FilesOutputStream files = new FilesOutputStream(bytes);
    callback.handle(files);
    files.close();

    // at this point bytes array holds zip compressed files archive
    FilesInputStream extractedFiles = new FilesInputStream(new ByteArrayInputStream(bytes.toByteArray()));
    AppsManager manager = Factory.getInstance(AppsManager.class);
    manager.synchronize(targetDir, extractedFiles);
  }

  private static SortedMap<String, byte[]> getSourceFiles(String sourceDir) throws FileNotFoundException, IOException
  {
    SortedMap<String, byte[]> sourceFiles = new TreeMap<String, byte[]>();
    for(String file : FilesIterator.getRelativeNamesIterator(sourceDir)) {
      sourceFiles.put(Files.path2unix(file), Files.getFileDigest(new File(sourceDir, file)));
    }
    return Collections.unmodifiableSortedMap(sourceFiles);
  }

  private static class MockHttpRequest extends HttpServletRequestStub
  {
    @Override
    public String getRemoteAddr()
    {
      return "localhost";
    }
  }

  private static interface Callback
  {
    void handle(FilesOutputStream files) throws IOException;
  }
}
