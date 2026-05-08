import sys
import os

import unittest
from app.api.schemas import ChatRequest, ChatResponse


class TestChatRequest(unittest.TestCase):
    def test_create_minimal(self):
        req = ChatRequest(message="Xin chào")
        self.assertEqual(req.message, "Xin chào")
        self.assertIsNone(req.conversation_id)
        self.assertIsNone(req.image)

    def test_create_full(self):
        req = ChatRequest(
            message="Giá in A5?",
            conversation_id="conv-123",
            image=b"fake_image_bytes"
        )
        self.assertEqual(req.conversation_id, "conv-123")
        self.assertEqual(req.image, b"fake_image_bytes")

    def test_empty_message_fails(self):
        with self.assertRaises(Exception):
            ChatRequest(message="")

    def test_message_too_long_fails(self):
        with self.assertRaises(Exception):
            ChatRequest(message="a" * 1001)

    def test_missing_message_fails(self):
        with self.assertRaises(Exception):
            ChatRequest()

    def test_conversation_id_default_none(self):
        req = ChatRequest(message="Test")
        self.assertIsNone(req.conversation_id)


class TestChatResponse(unittest.TestCase):
    def test_minimal(self):
        resp = ChatResponse(response="Xin chào")
        self.assertEqual(resp.response, "Xin chào")
        self.assertEqual(resp.sources, [])
        self.assertFalse(resp.redirect_to_zalo)
        self.assertIsNone(resp.zalo_link)
        self.assertIsNone(resp.conversation_id)
        self.assertIsNone(resp.metadata)

    def test_full(self):
        resp = ChatResponse(
            response="Câu trả lời",
            sources=["Doc1", "Doc2"],
            redirect_to_zalo=True,
            zalo_link="https://zalo.me/abc",
            conversation_id="conv-456",
            metadata={"intent": "product"}
        )
        self.assertEqual(resp.response, "Câu trả lời")
        self.assertEqual(resp.sources, ["Doc1", "Doc2"])
        self.assertTrue(resp.redirect_to_zalo)
        self.assertEqual(resp.zalo_link, "https://zalo.me/abc")
        self.assertEqual(resp.conversation_id, "conv-456")
        self.assertEqual(resp.metadata, {"intent": "product"})

    def test_missing_response_fails(self):
        with self.assertRaises(Exception):
            ChatResponse()

    def test_sources_wrong_type_fails(self):
        with self.assertRaises(Exception):
            ChatResponse(response="OK", sources=[1,2,3])

    def test_default_redirect_false(self):
        resp = ChatResponse(response="Ok")
        self.assertFalse(resp.redirect_to_zalo)


if __name__ == '__main__':
    unittest.main()