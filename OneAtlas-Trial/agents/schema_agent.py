import json

from utils.llm import generate_response

from schemas.db_schema import DatabaseSchema
from schemas.api_schema import APISchema
from schemas.ui_schema import UISchema
from schemas.auth_schema import AuthSchema


def generate_database_schema(intent_data, design_data):

    prompt = f"""
    You are a Database Schema Generation Agent.

    Using the following intent data:

    {intent_data}

    And design data:

    {design_data}

    Generate a database schema.

    Return ONLY valid JSON in EXACTLY this format:

    {{
        "tables": [
            {{
                "table_name": "users",
                "columns": [
                    {{
                        "name": "id",
                        "type": "integer"
                    }},
                    {{
                        "name": "email",
                        "type": "string"
                    }}
                ]
            }}
        ]
    }}

    IMPORTANT:
    - Return ONLY valid JSON
    - No explanations
    """

    response = generate_response(prompt)

    cleaned_response = (
        response.strip()
        .replace("```json", "")
        .replace("```", "")
    )

    parsed_json = json.loads(cleaned_response)

    validated_schema = DatabaseSchema(**parsed_json)

    return validated_schema


def generate_api_schema(intent_data, design_data):

    prompt = f"""
    You are an API Schema Generation Agent.

    Using the following intent data:

    {intent_data}

    And design data:

    {design_data}

    Generate API endpoints.

    Return ONLY valid JSON in EXACTLY this format:

    {{
        "endpoints": [
            {{
                "path": "/users",
                "method": "GET",
                "description": "Get all users"
            }}
        ]
    }}

    IMPORTANT:
    - Return ONLY valid JSON
    - No explanations
    """

    response = generate_response(prompt)

    cleaned_response = (
        response.strip()
        .replace("```json", "")
        .replace("```", "")
    )

    parsed_json = json.loads(cleaned_response)

    validated_schema = APISchema(**parsed_json)

    return validated_schema


def generate_ui_schema(intent_data, design_data):

    prompt = f"""
    You are a UI Schema Generation Agent.

    Using the following intent data:

    {intent_data}

    And design data:

    {design_data}

    Generate UI page schemas.

    Return ONLY valid JSON in EXACTLY this format:

    {{
        "pages": [
            {{
                "name": "Dashboard",
                "components": [
                    "Sidebar",
                    "Navbar",
                    "Analytics Chart"
                ]
            }}
        ]
    }}

    IMPORTANT:
    - Return ONLY valid JSON
    - No explanations
    """

    response = generate_response(prompt)

    cleaned_response = (
        response.strip()
        .replace("```json", "")
        .replace("```", "")
    )

    parsed_json = json.loads(cleaned_response)

    validated_schema = UISchema(**parsed_json)

    return validated_schema


def generate_auth_schema(intent_data, design_data):

    prompt = f"""
    You are an Authentication Schema Generation Agent.

    Using the following intent data:

    {intent_data}

    And design data:

    {design_data}

    Generate authentication and role schemas.

    Return ONLY valid JSON in EXACTLY this format:

    {{
        "roles": {{
            "Admin": [
                "manage_users",
                "view_analytics"
            ],

            "User": [
                "view_dashboard"
            ]
        }}
    }}

    IMPORTANT:
    - Return ONLY valid JSON
    - No explanations
    """

    response = generate_response(prompt)

    cleaned_response = (
        response.strip()
        .replace("```json", "")
        .replace("```", "")
    )

    parsed_json = json.loads(cleaned_response)

    validated_schema = AuthSchema(**parsed_json)

    return validated_schema