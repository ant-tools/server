package js.server.model;

import java.io.Serializable;
import java.util.Random;

import js.converter.Converter;
import js.converter.ConverterException;

/**
 * Project API key. Value is guarantee to have 6 characters length of [0-9a-z] set.
 * 
 * <pre>
 *  apikey = 6char
 *  char = 0-9 / a-z
 * </pre>
 * 
 * @author Iulian Rotaru
 * @since 1.1
 */
public class ApiKey implements Serializable, Converter
{
  /**
   * Java serialization version.
   */
  private static final long serialVersionUID = -490888357661126966L;

  private static transient Random random = new Random();

  private String value;
  private int hashCode;

  public ApiKey()
  {
    this(String.format("%6s", Integer.toString(random.nextInt(Integer.MAX_VALUE), 36)).replace(' ', '0'));
  }

  public ApiKey(String value)
  {
    this.value = value;

    // because apikey instance is immutable we can cache hash code value
    final int prime = 31;
    this.hashCode = 1;
    this.hashCode = prime * this.hashCode + ((this.value == null) ? 0 : this.value.hashCode());
  }

  public String getValue()
  {
    return value;
  }

  @Override
  public int hashCode()
  {
    return this.hashCode;
  }

  @Override
  public boolean equals(Object obj)
  {
    if(this == obj) return true;
    if(obj == null) return false;
    if(getClass() != obj.getClass()) return false;
    ApiKey other = (ApiKey)obj;
    if(value == null) {
      if(other.value != null) return false;
    }
    else if(!value.equals(other.value)) return false;
    return true;
  }

  @Override
  public String toString()
  {
    return this.value;
  }

  @SuppressWarnings("unchecked")
  @Override
  public <T> T asObject(String value, Class<T> type) throws IllegalArgumentException, ConverterException
  {
    assert type.equals(ApiKey.class);
    return (T)new ApiKey(value);
  }

  @Override
  public String asString(Object object) throws ConverterException
  {
    assert object instanceof ApiKey;
    return object instanceof ApiKey ? ((ApiKey)object).getValue() : null;
  }
}
