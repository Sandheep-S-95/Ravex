from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from mistralai import Mistral
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Initialize Mistral client
mistral_api_key = os.getenv('MISTRAL_API_KEY')
logger.debug(f"Mistral API Key loaded: {mistral_api_key[:4]}...")
client = Mistral(api_key=mistral_api_key)

@app.route('/')
def home():
    logger.debug("Received request to home endpoint")
    return jsonify({'message': 'Welcome to the Stock Analysis API'})

@app.route('/api/analyze-stock', methods=['POST'])
def analyze_stock():
    logger.debug("Received POST request to /api/analyze-stock")
    try:
        data = request.get_json()
        logger.debug(f"Request JSON data: {data}")
        stock_symbol = data.get('stock_symbol', '').upper()
        logger.debug(f"Extracted stock_symbol: {stock_symbol}")
        if not stock_symbol:
            logger.warning("No stock symbol provided in request")
            return jsonify({'error': 'Stock symbol is required'}), 400
        prompt = f"AFTER ANALYSING THE LIVE STOCK GRAPH OF '{stock_symbol}', PROVIDE A RESPONSE IN 1-2 LINES LIKE 'AFTER ANALYSING THE STOCK-GRAPH OF {stock_symbol}, THE STOCK PATTERNS I OBSERVE INCLUDE ...' AND END WITH A MANDATORY STATEMENT: 'YOU CAN INVEST' OR 'NOT RECOMMENDED TO INVEST' BASED ON THE ANALYSIS."
        logger.debug(f"Generated prompt: {prompt}")
        logger.debug("Calling Mistral AI API...")
        response = client.chat.complete(
            model="mistral-small-latest",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.7
        )
        logger.debug(f"Mistral AI response: {response.choices[0].message.content[:50]}...")
        analysis = response.choices[0].message.content.strip()
        logger.debug(f"Processed analysis: {analysis[:50]}...")
        return jsonify({
            'stock_symbol': stock_symbol,
            'analysis': analysis
        })
    except Exception as e:
        logger.error(f"Error in analyze_stock: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask app...")
    app.run(debug=True, host='0.0.0.0', port=8080)  # Changed from 6000 to 5000