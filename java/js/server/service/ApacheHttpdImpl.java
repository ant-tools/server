package js.server.service;

import java.io.File;
import java.io.IOException;

import js.core.AppContext;
import js.log.Log;
import js.log.LogFactory;
import js.server.model.ProjectDescriptor;

final class ApacheHttpdImpl implements ApacheHttpd
{
  /** Class logger. */
  private static final Log log = LogFactory.getLog(ApacheHttpd.class);

  private File DOC_ROOT;

  public ApacheHttpdImpl(AppContext context)
  {
    log.trace("ApacheHttpdImpl(AppContext)");
    String docRootProperty = context.getProperty("server.doc.root");
    if(docRootProperty == null) {
      log.info("Missing <server.doc.root> environment property. Server configured without doc root. It can be added to conf/properties.xml file, e.g. <property name='server.doc.root' value='/var/www/vhosts/' />");
      return;
    }
    DOC_ROOT = new File(docRootProperty);
  }

  @Override
  public void createProjectVirtualHost(ProjectDescriptor project) throws IOException
  {
    File docRoot = new File(DOC_ROOT, project.getVirtualHost());
    if(docRoot.exists()) {
      throw new IOException(String.format("Document root |%s| already exist.", docRoot));
    }
    if(!docRoot.mkdirs()) {
      throw new IOException(String.format("Fail to create directories path for document root |%s|.", docRoot));
    }

    // TODO uses project type to select virtual host template and create it in httpd configuration
    restart();
  }

  @Override
  public File getFile(String path)
  {
    return new File(DOC_ROOT, path);
  }

  @Override
  public void restart()
  {
    log.debug("Restart Apache HTTP Server.");
  }
}
