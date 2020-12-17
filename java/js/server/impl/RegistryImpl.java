package js.server.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.HashMap;
import java.util.Map;

import js.annotation.Public;
import js.annotation.Remote;
import js.annotation.Service;
import js.core.AppContext;
import js.lang.ManagedLifeCycle;
import js.log.Log;
import js.log.LogFactory;
import js.server.Registry;
import js.server.model.ApiKey;
import js.server.model.ProjectDescriptor;
import js.server.service.ApacheHttpd;
import js.util.Files;

@Service("registry")
@Public
final class RegistryImpl implements ManagedLifeCycle, Registry
{
  private static final Log log = LogFactory.getLog(Registry.class);

  // private static final String SER_FILE = "js-server-registry-projects.ser";
  private static final String SER_FILE = "registry.ser";

  // @Persistent("registry.ser")
  private Map<ApiKey, ProjectDescriptor> projects;

  private AppContext context;
  private ApacheHttpd apacheHttpd;

  public RegistryImpl(AppContext context, ApacheHttpd apacheHttpd)
  {
    super();
    this.context = context;
    this.apacheHttpd = apacheHttpd;
  }

  @Override
  @Remote
  @Public
  public ApiKey register(ProjectDescriptor project) throws IOException
  {
    ApiKey apikey = new ApiKey();
    this.projects.put(apikey, project);
    this.apacheHttpd.createProjectVirtualHost(project);
    return apikey;
  }

  @Override
  @Remote
  @Public
  public void remove(ApiKey apikey)
  {
    this.projects.remove(apikey);
  }

  @Override
  @Remote
  @Public
  public ProjectDescriptor getProjectDescriptor(ApiKey apikey)
  {
    return this.projects.get(apikey);
  }

  @SuppressWarnings("unchecked")
  @Override
  public void postConstruct() throws Exception
  {
    File file = getFile();
    if(!file.exists()) {
      log.debug("Missing registry storage |%s|. Create empty projects map.", file);
      this.projects = new HashMap<ApiKey, ProjectDescriptor>();
      return;
    }

    ObjectInputStream objectStream = null;
    try {
      objectStream = new ObjectInputStream(new FileInputStream(file));
      this.projects = (Map<ApiKey, ProjectDescriptor>)objectStream.readObject();
    }
    finally {
      Files.close(objectStream);
    }
  }

  @Override
  public void preDestroy() throws Exception
  {
    ObjectOutputStream objectStream = null;
    try {
      objectStream = new ObjectOutputStream(new FileOutputStream(getFile()));
      objectStream.writeObject(this.projects);
    }
    finally {
      Files.close(objectStream);
    }
  }

  private File getFile()
  {
    return context.getAppFile(SER_FILE);
  }
}
