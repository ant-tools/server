package js.server.impl;

import js.annotation.Public;
import js.annotation.Service;
import js.log.Log;
import js.log.LogFactory;
import js.server.TasksManager;
import js.server.model.Task;

/**
 * Implementation for tasks repository.
 * 
 * @author Iulian Rotaru
 * @since 1.0
 */
@Service("tasks")
@Public
final class TasksManagerImpl implements TasksManager
{
  private static final Log log = LogFactory.getLog(TasksManager.class);

  private static int idSeed;

  @Override
  public int updateTask(Task task)
  {
    int taskId = task.getId();
    if(taskId == 0) {
      taskId = ++idSeed;
    }
    return taskId;
  }

  @Override
  public void deleteTask(int taskId)
  {
    log.debug("TasksManager#deleteTask(int)");
  }
}
