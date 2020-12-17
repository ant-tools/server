package js.server;

import js.server.model.Task;

/**
 * Tasks repository.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
public interface TasksManager
{
  /**
   * Commit task changes to repository.
   * 
   * @param task
   * @return task id, newly created or existing.
   */
  int updateTask(Task task);

  void deleteTask(int taskId);
}
