from flask import Flask, request, jsonify, render_template
import requests as r

app = Flask(__name__)

@app.route('/', methods=["GET"])
def home():
    return render_template("index.html")

@app.route('/scan', methods=["POST"])
def barcode_scan():
    barcode_number = request.get_json().get('barcode')
    response = r.get(f"https://world.openfoodfacts.org/api/v2/product/{barcode_number}?fields=packaging")
    print(response.status_code)
    if response.status_code == 200:
        return jsonify({"packaging_recycling": response.json()}), 200
    else:
        return jsonify({"error": "Barcode not found!"}), 404

if __name__ == '__main__':
    app.run(debug=True)