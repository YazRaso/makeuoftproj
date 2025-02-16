from flask import Flask, request, jsonify, render_template
import serial
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

arduino = serial.Serial('COM6', 9600)  # Adjust 'COM3' to your Arduino's port

@app.route('/', methods=["GET"])
def home():
    return render_template("index.html")

@app.route('/open-bin', methods=['POST'])
def open_bin():
    print("Received request to open bin.")  #
    arduino.write(b"OPEN\n")
    print("Command sent to Arduino.")  # 
    return jsonify({"message": "Bin opening"}), 200

if __name__ == '__main__':
    app.run(debug=True)