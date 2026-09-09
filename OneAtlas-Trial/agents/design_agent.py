import json

from utils.llm import generate_response
from schemas.design_schema import DesignSchema


def generate_design(intent_data):
    prompt = f"""
You are a Software Architecture Agent.

Using the following application intent data:

{intent_data}

Generate application architecture.

Return ONLY valid JSON in EXACTLY this format:

{{
    "pages": [
        "Login",
        "Dashboard"
    ],

    "modules": [
        "Authentication",
        "Analytics"
    ],

    "role_permissions": {{
        "Admin": {{
            "Dashboard": ["view", "edit"],
            "Analytics": ["view"]
        }},

        "User": {{
            "Dashboard": ["view"]
        }}
    }},

    "dashboards": [
        {{
            "name": "Admin Dashboard",
            "access_roles": ["Admin"]
        }}
    ]
}}

IMPORTANT RULES:
- Return ONLY valid JSON
- Do NOT return explanations
- role_permissions MUST be nested dictionaries
- dashboards MUST contain objects
"""
    response = generate_response(prompt)

    cleaned_response = response.strip().replace("```json", "").replace("```", "")

    parsed_json = json.loads(cleaned_response)

    validated_design = DesignSchema(**parsed_json)

    return validated_design