def generate_models(db_schema):

    code = """
from sqlalchemy import Column, Integer, String
from database import Base

"""

    for table in db_schema.tables:

        class_name = table.table_name.capitalize()

        code += f"\nclass {class_name}(Base):\n"
        code += f"    __tablename__ = '{table.table_name}'\n\n"

        for column in table.columns:

            column_name = column.name
            column_type = column.type.lower()

            if column_type == "integer":
                sqlalchemy_type = "Integer"
            else:
                sqlalchemy_type = "String"

            code += (
                f"    {column_name} = "
                f"Column({sqlalchemy_type})\n"
            )

        code += "\n"

    return code