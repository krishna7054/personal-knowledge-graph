# coding: utf-8

"""
    Personal Knowledge Graph System

    No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)

    The version of the OpenAPI document: 0.1.0
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


import unittest

from openapi_client.api.notes_api import NotesApi


class TestNotesApi(unittest.TestCase):
    """NotesApi unit test stubs"""

    def setUp(self) -> None:
        self.api = NotesApi()

    def tearDown(self) -> None:
        pass

    def test_create_note_notes_post(self) -> None:
        """Test case for create_note_notes_post

        Create Note
        """
        pass

    def test_get_graph_notes_graph_get(self) -> None:
        """Test case for get_graph_notes_graph_get

        Get Graph
        """
        pass

    def test_link_note_notes_note_id_link_patch(self) -> None:
        """Test case for link_note_notes_note_id_link_patch

        Link Note
        """
        pass

    def test_read_note_notes_note_id_get(self) -> None:
        """Test case for read_note_notes_note_id_get

        Read Note
        """
        pass

    def test_read_notes_notes_get(self) -> None:
        """Test case for read_notes_notes_get

        Read Notes
        """
        pass


if __name__ == '__main__':
    unittest.main()
