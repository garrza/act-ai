from services.nlp_service import TaskSummarizer


def summarize_tasks(email_data):
    email_content = email_data["content"]
    tasks = TaskSummarizer().extract_tasks(email_content)
    return {"status": "success", "tasks": tasks}
