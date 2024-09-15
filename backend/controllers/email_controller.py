from services.gmail_service import GmailService


def read_emails():
    emails = GmailService().fetch_emails()
    return {
        'status': 'success',
        'emails': emails
    }

def metadata():
    metadata = GmailService().fetch_metadata()
    return {
        'metadata': metadata
    }