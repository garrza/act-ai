from services.gmail_service import GmailService

def read_emails():
    emails = GmailService().fetch_emails()
    return {
        'emails': emails
    }