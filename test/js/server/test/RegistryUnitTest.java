package js.server.test;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import js.core.Factory;
import js.lang.ManagedLifeCycle;
import js.server.Registry;
import js.server.model.ApiKey;
import js.server.model.ApiKeyException;
import js.server.model.ProjectDescriptor;
import js.unit.TestContext;
import js.util.Classes;
import junit.framework.TestCase;

public class RegistryUnitTest extends TestCase
{
  private static final String CONFIG = "" + //
      "<?xml version='1.0' encoding='UTF-8'?>" + //
      "<test-config>" + //
      "    <managed-classes>" + //
      "        <manager interface='js.server.Registry' class='js.server.impl.RegistryImpl' />" + //
      "        <manager interface='js.server.AppsManager' class='js.server.impl.AppsManagerImpl' />" + //
      "        <manager interface='js.server.service.ApacheHttpd' class='js.server.service.ApacheHttpdImpl' />" + //
      "    </managed-classes>" + //
      "</test-config>";

  @Override
  protected void setUp() throws Exception
  {
    TestContext.start(CONFIG);
  }

  public void testCreateApiKey()
  {
    for(int i = 0; i < 100000; ++i) {
      ApiKey apikey = new ApiKey();
      assertTrue(apikey.toString(), apikey.getValue().matches("[0-9a-z]{6}"));
    }
  }

  public void testRegisterProject() throws ApiKeyException, IOException
  {
    ProjectDescriptor project = new ProjectDescriptor();
    Classes.setFieldValue(project, "appName", "debug-app");
    Classes.setFieldValue(project, "webContext", "prj.comp.com");

    Registry registry = Factory.getInstance(Registry.class);
    ApiKey apikey = registry.register(project);

    assertNotNull(apikey);
    assertEquals(project, registry.getProjectDescriptor(apikey));
  }

  public void testRegistrySerialization() throws Exception
  {
    ProjectDescriptor project = new ProjectDescriptor();
    Classes.setFieldValue(project, "appName", "debug-app");
    Classes.setFieldValue(project, "webContext", "prj.comp.com");

    Registry registry = Factory.getInstance(Registry.class);
    ApiKey apikey = registry.register(project);

    ManagedLifeCycle lifeCycle = (ManagedLifeCycle)registry;
    lifeCycle.preDestroy();

    Map<ApiKey, ProjectDescriptor> projects = Classes.getFieldValue(registry, "projects");
    projects.clear();

    lifeCycle.postConstruct();

    assertEquals(project, registry.getProjectDescriptor(apikey));

    File registrySerFile = new File("fixture/tomcat/work/Applications/debug-app/registry.ser");
    assertTrue(registrySerFile.exists());
    registrySerFile.delete();
  }
}
