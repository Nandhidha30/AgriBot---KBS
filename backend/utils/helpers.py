# utils/helpers.py
import json
import os

def load_json_file(file_path):
    """Load JSON data from a given file path."""
    # Construct the absolute path from the current file's directory
    # This makes file loading reliable regardless of where the app is run from
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Go up one level (from utils to backend) then down to the target path
    full_path = os.path.join(base_dir, '..', file_path)
    
    try:
        with open(full_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Knowledge Base file not found at {full_path}")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {full_path}")
        return None