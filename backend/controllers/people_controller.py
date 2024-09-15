from services.people_service import PeopleService

def fetch_metadata():
    people_service = PeopleService()
    metadata = people_service.fetch_people()
    return {
        'metadata': metadata
    }