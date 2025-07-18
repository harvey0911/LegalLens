# LegalLens Project

This project involves AI-powered document analysis for legal files. The app helps in checking whether a company's response PDF satisfies the requirements in an 'appel d'offre'.

## Setup

1. Install dependencies: `pip install -r requirements.txt`
2. Run the Streamlit app: `streamlit run legalLens/app/main.py`
#   L e g a l L e n s 
 
 "# LegalLens"

## 📄 CPS Compliance Checker – Public Tender Validation with AI

### Description

This project is an AI-powered system that validates offers submitted in response to **public calls for tenders (appels d’offres)** in Morocco. It focuses on analyzing each bidder's offer to ensure full compliance with the rules, clauses, and legal obligations specified in the **Cahier des Prescriptions Spéciales (CPS)**.

Using modern Natural Language Processing (NLP) techniques **Large Language Models (LLMs)** , the system can automatically read the CPS and compare it to each submitted offer to check for:

*  Administrative conformity (required documents, declarations, guarantees)
*  Legal compliance (matching cited articles from **Décret n° 2-12-349** and other applicable laws)
*  Technical compliance (matching product/service specifications)
*  Social clause enforcement (local labor, inclusivity, etc.)
