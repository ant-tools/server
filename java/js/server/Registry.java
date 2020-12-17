package js.server;

import java.io.IOException;

import js.server.model.ApiKey;
import js.server.model.ProjectDescriptor;

public interface Registry
{
  ApiKey register(ProjectDescriptor project) throws IOException;

  void remove(ApiKey apikey);

  ProjectDescriptor getProjectDescriptor(ApiKey apikey);
}