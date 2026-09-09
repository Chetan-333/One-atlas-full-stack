import os


def create_folder(path):
    os.makedirs(path, exist_ok=True)


def write_file(path, content):

    with open(path, "w", encoding="utf-8") as file:
        file.write(content)