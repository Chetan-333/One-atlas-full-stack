from agents.schema_agent import generate_api_schema


def detect_repair_targets(validation_result):
    issues = validation_result.get("issues", [])

    targets = {
        "api": False,
        "db": False,
        "ui": False,
        "auth": False
    }

    for issue in issues:
        issue_lower = issue.lower()

        if "api endpoint" in issue_lower:
            targets["api"] = True

        if "database" in issue_lower or "table" in issue_lower:
            targets["db"] = True

        if "ui" in issue_lower or "page" in issue_lower:
            targets["ui"] = True

        if "role" in issue_lower or "permission" in issue_lower:
            targets["auth"] = True

    return targets


def repair_system(validation_result, intent, design, db_schema, api_schema, ui_schema, auth_schema):
    targets = detect_repair_targets(validation_result)

    repair_log = []

    if targets["api"]:
        api_schema = generate_api_schema(intent, design)
        repair_log.append("Regenerated API schema because API/database mismatch was detected.")

    return {
        "db_schema": db_schema,
        "api_schema": api_schema,
        "ui_schema": ui_schema,
        "auth_schema": auth_schema,
        "repair_log": repair_log
    }