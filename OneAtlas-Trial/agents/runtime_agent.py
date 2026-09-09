from runtime.generate_models import generate_models
from runtime.generate_routes import generate_routes
from runtime.generate_ui import generate_ui
from runtime.generate_auth import generate_auth
from runtime.generate_streamlit_app import generate_streamlit_app

from runtime.file_writer import (
    create_folder,
    write_file
)


def generate_application(
    app_name,
    db_schema,
    api_schema,
    ui_schema,
    auth_schema,
    intent
):

    base_path = f"generated_apps/{app_name}"

    create_folder(base_path)

    backend_path = f"{base_path}/backend"
    frontend_path = f"{base_path}/frontend"

    create_folder(backend_path)
    create_folder(frontend_path)

    # Generate files
    models_code = generate_models(db_schema)
    routes_code = generate_routes(api_schema)
    ui_code = generate_ui(ui_schema)
    auth_code = generate_auth(auth_schema)

    # Write files
    write_file(
        f"{backend_path}/models.py",
        models_code
    )

    write_file(
        f"{backend_path}/routes.py",
        routes_code
    )

    write_file(
        f"{frontend_path}/ui_config.json",
        ui_code
    )

    write_file(
        f"{backend_path}/auth.json",
        auth_code
    )
    # Generate Streamlit app
    streamlit_app_code = generate_streamlit_app(intent, ui_schema)

    write_file(
    f"{base_path}/app.py",
    streamlit_app_code
)
    return {
        "status": "success",
        "path": base_path
    }