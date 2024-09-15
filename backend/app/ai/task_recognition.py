import openai
import re


class TaskRecognition:
    def __init__(self, api_key):
        self.api_key = api_key
        openai.api_key = self.api_key

    def extract_task_and_url(self, email_text):
        task = self.extract_task(email_text)
        url = self.extract_url(email_text)
        if not url:
            url = self.suggest_url(email_text)
        return task, url

    def extract_task(self, email_text):
        prompt = f"""
        Given the following email text, extract the main task or action item required:

        Email: {email_text}

        Task:
        """

        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that extracts tasks from emails.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=100,
        )

        return response.choices[0].message.content.strip()

    def summarize_email(self, email_text):
        prompt = f"Summarize the main action required from this email: {email_text}"
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that summarizes emails.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=50,
        )
        return response.choices[0].message.content.strip()

    def extract_url(self, email_text):
        url_pattern = re.compile(r"(https?://[^\s]+)")
        urls = url_pattern.findall(email_text)
        return urls[0] if urls else None

    def suggest_url(self, email_text):
        prompt = f"""
        Given the following email content, suggest a URL that would be appropriate for the context if none is provided:

        Email: {email_text}

        Suggested URL:
        """
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that suggests URLs based on email content.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=100,
        )
        return response.choices[0].message.content.strip()
