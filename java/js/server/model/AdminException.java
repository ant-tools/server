package js.server.model;

public class AdminException extends RuntimeException
{
  /**
   * Java serialization version.
   */
  private static final long serialVersionUID = -4469058426561464601L;

  public AdminException(String message, Object... args)
  {
    super(String.format(message, args));
  }
}
