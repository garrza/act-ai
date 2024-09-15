from models.user import Task

class TaskHandler:
    def __init__(self, agent, task_recognition):
        self.agent = agent
        self.task_recognition = task_recognition

    def execute_task(self, email_text, user_id):
        task, url = self.task_recognition.extract_task_and_url(email_text)
        print(f"Extracted Task: {task}")
        print(f"Extracted/Suggested URL: {url}")

        self.agent.get(url)

        result = self.agent.run(task)
        print(f"Task Result: {result}")

        # Store task in database
        Task.create(user_id, email_text, task, str(result))

        return result
