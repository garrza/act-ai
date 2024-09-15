import google_auth_oauthlib.flow
import googleapiclient.discovery

class PeopleService:
    def __init__(self):
        self.service = self.connect_to_people()

    def connect_to_people(self):
        flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
            "credentials.json",
            scopes=[
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile",
                "openid" 
            ]
        )
        credentials = flow.run_local_server(port=0)
        service = googleapiclient.discovery.build(
            "people", "v1", credentials=credentials
        )
        return service
    
    def fetch_people(self):
        result = self.service.people().get(
            resourceName="people/me",
            personFields="names,emailAddresses"
        ).execute()
        
        metadata = {
            "name": result.get("names", [{}])[0].get("displayName", "No Name"),
            "email": result.get("emailAddresses", [{}])[0].get("value", "No Email")
        }

        return metadata
