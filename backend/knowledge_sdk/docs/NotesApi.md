# openapi_client.NotesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_note_notes_post**](NotesApi.md#create_note_notes_post) | **POST** /notes/ | Create Note
[**get_graph_notes_graph_get**](NotesApi.md#get_graph_notes_graph_get) | **GET** /notes/graph/ | Get Graph
[**link_note_notes_note_id_link_patch**](NotesApi.md#link_note_notes_note_id_link_patch) | **PATCH** /notes/{note_id}/link | Link Note
[**read_note_notes_note_id_get**](NotesApi.md#read_note_notes_note_id_get) | **GET** /notes/{note_id} | Read Note
[**read_notes_notes_get**](NotesApi.md#read_notes_notes_get) | **GET** /notes/ | Read Notes


# **create_note_notes_post**
> Note create_note_notes_post(note_create)

Create Note

### Example


```python
import openapi_client
from openapi_client.models.note import Note
from openapi_client.models.note_create import NoteCreate
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.NotesApi(api_client)
    note_create = openapi_client.NoteCreate() # NoteCreate | 

    try:
        # Create Note
        api_response = api_instance.create_note_notes_post(note_create)
        print("The response of NotesApi->create_note_notes_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling NotesApi->create_note_notes_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **note_create** | [**NoteCreate**](NoteCreate.md)|  | 

### Return type

[**Note**](Note.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_graph_notes_graph_get**
> Graph get_graph_notes_graph_get()

Get Graph

### Example


```python
import openapi_client
from openapi_client.models.graph import Graph
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.NotesApi(api_client)

    try:
        # Get Graph
        api_response = api_instance.get_graph_notes_graph_get()
        print("The response of NotesApi->get_graph_notes_graph_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling NotesApi->get_graph_notes_graph_get: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**Graph**](Graph.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **link_note_notes_note_id_link_patch**
> Note link_note_notes_note_id_link_patch(note_id, link_create)

Link Note

### Example


```python
import openapi_client
from openapi_client.models.link_create import LinkCreate
from openapi_client.models.note import Note
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.NotesApi(api_client)
    note_id = 56 # int | 
    link_create = openapi_client.LinkCreate() # LinkCreate | 

    try:
        # Link Note
        api_response = api_instance.link_note_notes_note_id_link_patch(note_id, link_create)
        print("The response of NotesApi->link_note_notes_note_id_link_patch:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling NotesApi->link_note_notes_note_id_link_patch: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **note_id** | **int**|  | 
 **link_create** | [**LinkCreate**](LinkCreate.md)|  | 

### Return type

[**Note**](Note.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **read_note_notes_note_id_get**
> Note read_note_notes_note_id_get(note_id)

Read Note

### Example


```python
import openapi_client
from openapi_client.models.note import Note
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.NotesApi(api_client)
    note_id = 56 # int | 

    try:
        # Read Note
        api_response = api_instance.read_note_notes_note_id_get(note_id)
        print("The response of NotesApi->read_note_notes_note_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling NotesApi->read_note_notes_note_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **note_id** | **int**|  | 

### Return type

[**Note**](Note.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **read_notes_notes_get**
> List[Note] read_notes_notes_get(tag=tag, keyword=keyword, skip=skip, limit=limit)

Read Notes

### Example


```python
import openapi_client
from openapi_client.models.note import Note
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.NotesApi(api_client)
    tag = 'tag_example' # str |  (optional)
    keyword = 'keyword_example' # str |  (optional)
    skip = 0 # int |  (optional) (default to 0)
    limit = 100 # int |  (optional) (default to 100)

    try:
        # Read Notes
        api_response = api_instance.read_notes_notes_get(tag=tag, keyword=keyword, skip=skip, limit=limit)
        print("The response of NotesApi->read_notes_notes_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling NotesApi->read_notes_notes_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tag** | **str**|  | [optional] 
 **keyword** | **str**|  | [optional] 
 **skip** | **int**|  | [optional] [default to 0]
 **limit** | **int**|  | [optional] [default to 100]

### Return type

[**List[Note]**](Note.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

