package js.server.model;

import java.io.Serializable;

public class ProjectDescriptor implements Serializable
{
  /**
   * Java serialization version.
   */
  private static final long serialVersionUID = -6894130737777003553L;

  private String appName;
  private String webContext;
  private String virtualHost;

  public void setAppName(String appName)
  {
    this.appName = appName;
  }

  public void setWebContext(String webContext)
  {
    this.webContext = webContext;
  }

  public void setVirtualHost(String virtualHost)
  {
    this.virtualHost = virtualHost;
  }

  public String getAppName()
  {
    return this.appName;
  }

  public String getWebContext()
  {
    return this.webContext;
  }

  public String getVirtualHost()
  {
    return this.virtualHost;
  }

  @Override
  public int hashCode()
  {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((appName == null) ? 0 : appName.hashCode());
    result = prime * result + ((virtualHost == null) ? 0 : virtualHost.hashCode());
    result = prime * result + ((webContext == null) ? 0 : webContext.hashCode());
    return result;
  }

  @Override
  public boolean equals(Object obj)
  {
    if(this == obj) return true;
    if(obj == null) return false;
    if(getClass() != obj.getClass()) return false;
    ProjectDescriptor other = (ProjectDescriptor)obj;
    if(appName == null) {
      if(other.appName != null) return false;
    }
    else if(!appName.equals(other.appName)) return false;
    if(virtualHost == null) {
      if(other.virtualHost != null) return false;
    }
    else if(!virtualHost.equals(other.virtualHost)) return false;
    if(webContext == null) {
      if(other.webContext != null) return false;
    }
    else if(!webContext.equals(other.webContext)) return false;
    return true;
  }

  @Override
  public String toString()
  {
    return this.appName;
  }

  public static enum Type
  {
    NONE, WEB_APP, STATIC_SITE, SMART_VIEW, SERVICE
  }
}
