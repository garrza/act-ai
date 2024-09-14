import google_auth_oauthlib.flow
import googleapiclient.discovery


class GmailService:
    def __init__(self):
        self.service = self.connect_to_gmail()

    def connect_to_gmail(self):
        # Set up Gmail API authentication
        flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
            "client_secret.json",
            scopes=["https://www.googleapis.com/auth/gmail.readonly"],
        )
        credentials = flow.run_local_server(port=0)
        service = googleapiclient.discovery.build(
            "gmail", "v1", credentials=credentials
        )
        return service

    def fetch_emails(self):
        # Fetch list of emails
        result = self.service.users().messages().list(userId="me").execute()
        messages = result.get("messages", [])
        emails = []
        for message in messages:
            msg = (
                self.service.users()
                .messages()
                .get(userId="me", id=message["id"])
                .execute()
            )
            emails.append(msg["snippet"])
        return emails
