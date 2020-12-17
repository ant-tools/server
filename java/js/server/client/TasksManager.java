package js.server.client;

import js.server.model.Task;

public interface TasksManager
{
  int updateTask(Task task);

  void deleteTask(int taskId);
}
