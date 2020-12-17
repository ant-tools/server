package js.server.service;

import java.io.File;
import java.io.IOException;

import js.server.model.ProjectDescriptor;

public interface ApacheHttpd
{
  void createProjectVirtualHost(ProjectDescriptor project) throws IOException;

  File getFile(String path);

  void restart();
}
