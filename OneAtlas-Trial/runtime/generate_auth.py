import json


def generate_auth(auth_schema):

    return json.dumps(
        auth_schema.model_dump(),
        indent=4
    )