package js.server.model;


public class ApiKeyException extends Exception
{
  /**
   * Java serialization version.
   */
  private static final long serialVersionUID = -1066647212473798300L;

  public ApiKeyException(String message)
  {
    super(message);
  }

  public ApiKeyException(ApiKey apikey)
  {
    super(String.format("Invalid API key |%s|.", apikey));
  }
}
