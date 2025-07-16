import pytesseract
from pdf2image import convert_from_path
import fitz  # PyMuPDF
import re  # For structuring text
from pymongo import MongoClient

# Connect to MongoDB
def connect_to_mongo():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["LegalLens"]
    collection = db["decret_articles"]
    return collection

# Function to extract text from a text-based PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    full_text = "\n".join([page.get_text("text") for page in doc])
    return full_text.strip()

# Function to extract text from an image-based PDF using OCR
def extract_text_from_image_pdf(pdf_path):
    images = convert_from_path(pdf_path)
    extracted_text = "\n".join([pytesseract.image_to_string(image) for image in images])
    return extracted_text.strip()

# Function to determine if a PDF is text-based or image-based
def is_pdf_text_based(pdf_path):
    doc = fitz.open(pdf_path)
    for page in doc:
        text = page.get_text("text")
        if text.strip():
            return True  
    return False  

# Function to structure extracted text into articles
def extract_articles(text):
    article_pattern = r"(Article\s+\d+.*?)\n(?=Article\s+\d+|\Z)"  # Regex pattern for articles
    matches = re.findall(article_pattern, text, re.DOTALL)
    
    articles = {}
    for match in matches:
        lines = match.split("\n", 1)  # Split article title from content
        if len(lines) == 2:
            title, content = lines
            articles[title.strip()] = content.strip()
    
    return articles

# Function to save extracted articles to MongoDB
def save_articles_to_mongo(articles):
    collection = connect_to_mongo()
    for title, content in articles.items():
        article_document = {
            "title": title,
            "content": content
        }
        collection.insert_one(article_document)
