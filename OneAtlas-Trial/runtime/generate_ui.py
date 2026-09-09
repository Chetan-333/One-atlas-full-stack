import json


def generate_ui(ui_schema):

    ui_config = []

    for page in ui_schema.pages:

        ui_config.append({
            "page": page.name,
            "components": page.components
        })

    return json.dumps(ui_config, indent=4)