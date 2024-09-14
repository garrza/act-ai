from transformers import pipeline


class TaskSummarizer:
    def __init__(self):
        self.model = pipeline("summarization")

    def extract_tasks(self, email_content):
        summary = self.model(
            email_content, max_length=50, min_length=10, do_sample=False
        )
        # Simple task extraction based on summary
        tasks = self.parse_summary_for_tasks(summary[0]["summary_text"])
        return tasks

    def parse_summary_for_tasks(self, summary_text):
        # Placeholder for extracting tasks from the summary
        # Could be improved using more task-oriented NLP
        tasks = []
        if "meeting" in summary_text:
            tasks.append("Schedule Meeting")
        if "follow up" in summary_text:
            tasks.append("Send Follow-up Email")
        return tasks
