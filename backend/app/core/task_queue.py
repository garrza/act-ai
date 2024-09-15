from queue import Queue


class TaskQueue:
    def __init__(self, tasks):
        self.tasks = tasks

    def process_tasks(self, task_handler):
        for task in self.tasks:
            task_handler.execute_task(task["email_text"])
