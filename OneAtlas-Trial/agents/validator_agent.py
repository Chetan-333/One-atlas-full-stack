def validate_system(
    db_schema,
    api_schema,
    ui_schema,
    auth_schema
):

    issues = []

    # Collect DB tables
    table_names = [
        table.table_name.lower()
        for table in db_schema.tables
    ]

    # Validate API endpoints
    for endpoint in api_schema.endpoints:

        path_name = endpoint.path.replace("/", "").lower()

        if path_name not in table_names:
            issues.append(
                f"API endpoint '{endpoint.path}' has no matching database table."
            )

    # Validate auth roles
    auth_roles = auth_schema.roles.keys()

    # Example UI validation
    for page in ui_schema.pages:

        if len(page.components) == 0:
            issues.append(
                f"Page '{page.name}' has no UI components."
            )

    if len(issues) == 0:
        return {
            "status": "success",
            "issues": []
        }

    return {
    "status": "failed",
    "issues": issues,
    "needs_repair": len(issues) > 0
}