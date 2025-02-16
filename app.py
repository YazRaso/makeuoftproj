import streamlit as st
import requests
import google.generativeai as genai
import time
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Configure API key for generative AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

st.title("Battle of Bins")

# Simple text input for barcode
barcode = st.text_input("Enter Barcode Number", placeholder="e.g., 5449000000996")
is_recyclable = False

if barcode:
    st.success(f"Processing Barcode: {barcode}")
    
    # Fetch product info from Open Food Facts
    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}?fields=product_name,generic_name,packaging"
    response = requests.get(url)
    st.write(f"Response Status Code: {response.status_code}")
    st.write(f"Response Content: {response.text}")
    if response.status_code == 200:
        data = response.json()
        product = data.get("product", {})
        product_name = product.get("product_name", "Unknown Product")
        product_description = product.get("generic_name", "No description available")
        packaging_info = product.get("packaging", "No packaging info available.")

        # Display product information
        st.write(product_name)

        # Generate AI-based comments on recyclability using Gemini
        model = genai.GenerativeModel("gemini-pro")
        
        response = model.generate_content(
            f"Determine if the following packaging is recyclable and provide a comment and fun fact: {packaging_info}. Ensure your conclusion is realistic. If there is no information available, it is not recyclable. If it is not recyclable, provide a short report including: where to dispose, estimate the environmental impact of using packaging this packaging and compare it to more sustainable alternatives"
        )
        detailed_comment = response.text

        boolean_response = model.generate_content(
            f"""Based on this analysis: {detailed_comment}
            Answer with ONLY the word 'true' or 'false' - is this packaging recyclable? Think thoroughly before answering.
            """
        )
        is_recyclable = boolean_response.text.strip().lower() == 'true'

        # Display results
        st.subheader("Recyclability Analysis")
        if is_recyclable:
            time.sleep(0.1)
            st.success("✅ Go ahead and recycle this to keep it out of the landfill!")
        else:
            st.error("❌ This packaging is not recyclable.")
        
        st.write(detailed_comment)
    else:
        st.error("Failed to fetch product data. Please try again.")

# Add some helpful instructions
st.markdown("""
---
### How to use:
1. Enter a product barcode number in the text box above
2. Press Enter or click outside the text box
3. BOB will fetch packaging information and analyze recyclability
4. If the product is recyclable, the bin will open and you can throw the product in!
""")

st.markdown("""
---
### How it works:
- Streamlit is used to create the web app interface
- Open Food Facts API is used to fetch product information
- Gemini AI API is used to generate comments on recyclability
""")