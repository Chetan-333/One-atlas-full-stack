def generate_routes(api_schema):

    code = """
from fastapi import APIRouter

router = APIRouter()

"""

    for endpoint in api_schema.endpoints:

        method = endpoint.method.lower()
        path = endpoint.path

        function_name = (
            path.replace("/", "_")
            .replace("-", "_")
        )

        code += f"""
@router.{method}("{path}")
def {function_name}():
    return {{"message": "{endpoint.description}"}}

"""

    return code