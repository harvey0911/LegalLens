import os

# Create the necessary directories and files for the project
def create_project_structure():
    project_dir = os.getcwd()  # Current directory (should be LegalLens)
    
    # Define project folders
    project_folders = [
        'legalLens/app',    # app folder inside legalLens
    ]
    
    # Create the folders
    for folder in project_folders:
        folder_path = os.path.join(project_dir, folder)
        os.makedirs(folder_path, exist_ok=True)
        print(f"Created folder: {folder_path}")
    
    # Define file paths
    files = {
        'requirements.txt': '''streamlit
sqlite3
# Add other dependencies here
''',
        'README.md': '''# LegalLens Project

This project involves AI-powered document analysis for legal files. The app helps in checking whether a company's response PDF satisfies the requirements in an 'appel d'offre'.

## Setup

1. Install dependencies: `pip install -r requirements.txt`
2. Run the Streamlit app: `streamlit run legalLens/app/main.py`
''',
        'legalLens/app/main.py': '''import streamlit as st

def main():
    st.title('LegalLens - Document Analysis')
    st.write('This is the entry point for the legal document analysis app.')

if __name__ == "__main__":
    main()
'''
    }
    
    # Create the files with the content
    for file_name, content in files.items():
        file_path = os.path.join(project_dir, file_name)
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"Created file: {file_path}")

if __name__ == "__main__":
    create_project_structure()
