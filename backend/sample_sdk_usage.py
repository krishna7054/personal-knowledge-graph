import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))  # ensures backend/ is in sys.path

from openapi_client import Configuration, ApiClient
from openapi_client.api.notes_api import NotesApi  # replace with correct API class

config = Configuration(host="http://localhost:8000")
with ApiClient(config) as client:
    api = NotesApi(client)
    notes = api.get_graph_notes_graph_get()
    print(notes)

