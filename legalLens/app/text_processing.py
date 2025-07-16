import re
import spacy

# Load spaCy model (French)
nlp = spacy.load("fr_core_news_sm")

# Regex patterns
article_pattern = re.compile(r"Article\s+(\d+)[\s:-]*(.*)")
bullet_pattern = re.compile(r"^\s*[-•]\s+(.*)")
numbered_pattern = re.compile(r"^\s*\d+\.\s+(.*)")
lettered_pattern = re.compile(r"^\s*[a-z]\)\s+(.*)")
roman_pattern = re.compile(r"^\s*[ivxlcdm]+\.\s+(.*)")

# Function to structure articles and nested rules
def extract_articles(text):
    lines = text.split("\n")
    articles = []
    current_article = None
    current_rule = None

    for line in lines:
        line = line.strip()
        if not line:
            continue  # Skip empty lines

        doc = nlp(line)  # Process with spaCy for better text structure

        # Detect Articles with improved regex
        match_article = article_pattern.match(line)
        if match_article:
            if current_article:
                articles.append(current_article)
            current_article = {
                "article_number": int(match_article.group(1)),
                "title": match_article.group(2).strip(),
                "rules": []
            }
            current_rule = None
            continue  # Skip further processing for this line if it's an article header
        
        # Detect Primary Rules (Bullets, Numbered)
        if bullet_pattern.match(line) or numbered_pattern.match(line):
            current_rule = {"text": line, "sub_rules": []}
            if current_article:
                current_article["rules"].append(current_rule)
        
        # Detect Lettered Sub-Rules (a, b, c...)
        elif lettered_pattern.match(line):
            sub_rule = {"text": line, "sub_rules": []}
            if current_rule:
                current_rule["sub_rules"].append(sub_rule)
        
        # Detect Roman Sub-Rules (i, ii, iii...)
        elif roman_pattern.match(line):
            sub_sub_rule = {"text": line}
            if current_rule and current_rule["sub_rules"]:
                current_rule["sub_rules"][-1]["sub_rules"].append(sub_sub_rule)
    
    if current_article:
        articles.append(current_article)

    return articles
