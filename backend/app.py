# app.py
from flask import Flask
from flask_cors import CORS
from routes.api_routes import api_bp

# Initialize Flask app
app = Flask(__name__)

# Configure CORS to allow frontend (React default is 3000)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Register blueprint for API routes
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/', methods=['GET'])
def home():
    """Simple health check route."""
    return "KBS Agriculture Backend is running!"

if __name__ == '__main__':
    # Run the application
    # Note: Flask's default development port is 5000
    app.run(debug=True, port=5000)