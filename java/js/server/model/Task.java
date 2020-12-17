package js.server.model;

public class Task
{
  private int id;
  private String summary;
  private String description;
  private Priority priority;
  private String category;

  public String getSummary()
  {
    return summary;
  }

  public void setSummary(String summary)
  {
    this.summary = summary;
  }

  public String getDescription()
  {
    return description;
  }

  public void setDescription(String description)
  {
    this.description = description;
  }

  public Priority getPriority()
  {
    return priority;
  }

  public void setPriority(Priority priority)
  {
    this.priority = priority;
  }

  public String getCategory()
  {
    return category;
  }

  public void setCategory(String category)
  {
    this.category = category;
  }

  public int getId()
  {
    return id;
  }

  public static enum Priority
  {
    P1, P2, P3, P4, P5
  }
}
