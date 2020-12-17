package js.server.controller;

import java.security.Principal;

import js.annotation.Public;
import js.annotation.Remote;
import js.core.AppContext;

@Remote
@Public
public class Controller
{
  private final AppContext context;

  public Controller(AppContext context)
  {
    this.context = context;
  }

  public void login()
  {
    context.login(new User());
  }

  public void logout()
  {
    context.logout();
  }

  private static final class User implements Principal
  {
    @Override
    public String getName()
    {
      return "server-user";
    }
  }
}
