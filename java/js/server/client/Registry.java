package js.server.client;

import js.annotation.Public;
import js.annotation.Remote;
import js.lang.Callback;
import js.server.model.ApiKey;
import js.server.model.ApiKeyException;
import js.server.model.ProjectDescriptor;

@Remote
@Public
public interface Registry
{
  void register(ProjectDescriptor project, Callback<ApiKey> callback);

  void remove(ApiKey apikey) throws ApiKeyException;

  void getProjectDescriptor(ApiKey apikey, Callback<ProjectDescriptor> callback) throws ApiKeyException;

  ApiKey register(ProjectDescriptor project);

  ProjectDescriptor getProjectDescriptor(ApiKey apikey) throws ApiKeyException;
}
