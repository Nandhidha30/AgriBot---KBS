# routes/api_routes.py
from flask import Blueprint, request, jsonify
from inference_engine.engine import run_diagnosis, get_initial_symptoms

api_bp = Blueprint('api', __name__)

@api_bp.route('/diagnose', methods=['POST'])
def diagnose():
    """
    API endpoint to receive symptoms and return a diagnosis.
    
    Expected JSON body: {"symptoms": ["symptom_key_1", "symptom_key_2"]}
    """
    data = request.get_json()
    symptoms = data.get('symptoms', [])
    
    if not symptoms:
        return jsonify({"error": "No symptoms provided."}), 400
    
    # Run the KBS inference engine
    result = run_diagnosis(symptoms)
    
    return jsonify(result), 200

@api_bp.route('/symptoms', methods=['GET'])
def get_symptoms():
    """
    API endpoint to get the list of available symptoms for the frontend form.
    """
    symptoms_map = get_initial_symptoms()
    
    # Convert the key-value map into a list of objects for easier React mapping
    symptoms_list = [{"key": k, "label": v} for k, v in symptoms_map.items()]
    
    return jsonify(symptoms_list), 200