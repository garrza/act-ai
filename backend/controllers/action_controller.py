from services.playwright_service import WebAutomation


def perform_task(task_data):
    task_type = task_data["task_type"]
    success = WebAutomation().execute_action(task_type, task_data)
    return {
        "status": "success" if success else "failed",
        "message": "Task executed successfully" if success else "Task failed",
    }
