import streamlit as st
from text_processing import extract_articles  # Import extraction function
import fitz  # PyMuPDF
import pytesseract
from pdf2image import convert_from_path

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    return "\n".join([page.get_text("text") for page in doc]).strip()

def extract_text_from_image_pdf(pdf_path):
    images = convert_from_path(pdf_path)
    return "\n".join([pytesseract.image_to_string(image) for image in images]).strip()

def is_pdf_text_based(pdf_path):
    doc = fitz.open(pdf_path)
    return any(page.get_text("text").strip() for page in doc)

def main():
    st.title("LegalLens - AI-Powered Document Analysis")
    
    st.write("Welcome to LegalLens! This app will help you check the validity of your CPS.")
    
    uploaded_file = st.file_uploader("Choose a PDF", type=["pdf"])
    
    if uploaded_file is not None:
        st.write("File uploaded successfully!")
        pdf_path = "temp_uploaded.pdf"
        with open(pdf_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        
        # Extract text based on PDF type
        extracted_text = extract_text_from_pdf(pdf_path) if is_pdf_text_based(pdf_path) else extract_text_from_image_pdf(pdf_path)
        
        # Display extracted text preview
        st.subheader("Extracted Text Preview:")
        st.text(extracted_text[:1000])  # Show the first 1000 characters of the text
        
        # Extract articles
        st.subheader("Extracted Articles:")
        articles = extract_articles(extracted_text)
        
        if articles:
            for article in articles:
                with st.expander(f"Article {article['article_number']}: {article['title']}"):
                    for rule in article["rules"]:
                        st.write(f"- {rule['text']}")
                        for sub_rule in rule["sub_rules"]:
                            st.write(f"  • {sub_rule['text']}")
                            for sub_sub_rule in sub_rule["sub_rules"]:
                                st.write(f"    ◦ {sub_sub_rule['text']}")
        else:
            st.write("No articles found.")

if __name__ == "__main__":
    main()
