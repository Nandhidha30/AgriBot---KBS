# D:\KBS_Agriculture\backend\inference_engine\engine.py
from utils.helpers import load_json_file

class InferenceEngine:
    def __init__(self):
        self.kb_data = load_json_file('inference_engine/kb_rules.json')
        if not self.kb_data:
            self.rules = []
            print("Warning: Inference Engine initialized with empty Knowledge Base.")
        else:
            self.rules = self.kb_data.get('rules', [])

    def infer_diagnosis(self, evidence):
        """
        Implements Forward Chaining with Certainty Factor (CF) propagation.
        Assumes initial evidence (facts) have a CF of 1.0.
        """
        # Working memory stores facts and their associated CF: {'fact_key': cf_value}
        working_memory = {fact: 1.0 for fact in evidence}
        new_facts_inferred = True
        
        while new_facts_inferred:
            new_facts_inferred = False
            for rule in self.rules:
                conclusion = rule['conclusion']
                conditions = rule['conditions']
                rule_cf = rule.get('cf', 1.0) 

                # Check if ALL conditions of the rule are present in the working memory
                if all(c in working_memory for c in conditions):
                    
                    # 1. Determine CF of the premise (Minimum CF of all conditions)
                    premise_cf = min(working_memory[c] for c in conditions)
                    
                    # 2. Calculate CF of the conclusion: CF(Conclusion) = CF(Premise) * CF(Rule)
                    new_conclusion_cf = premise_cf * rule_cf
                    
                    # 3. Update working memory if this is a new fact or has a higher CF
                    # Note: We prioritize the highest CF if multiple paths lead to the same conclusion
                    if conclusion not in working_memory or new_conclusion_cf > working_memory[conclusion]:
                        working_memory[conclusion] = new_conclusion_cf
                        new_facts_inferred = True

        # Final check: Find the diagnosis with the highest CF above a threshold
        best_diagnosis = None
        best_cf = 0.0
        
        for conclusion, cf in working_memory.items():
            if conclusion.startswith("Diagnosis:") and cf > best_cf:
                best_cf = cf
                best_diagnosis = conclusion
                
        # Return the best diagnosis if the CF is reasonably high
        if best_cf >= 0.1 and best_diagnosis:
            try:
                # Find the rule that led to this final conclusion to get the recommendation
                rule = next(r for r in self.rules if r['conclusion'] == best_diagnosis)
                return {
                    "diagnosis": best_diagnosis,
                    "recommendation": rule['recommendation'],
                    "certainty_factor": best_cf
                }
            except StopIteration:
                # Fallback if rule not found (shouldn't happen with proper KB structure)
                pass

        # Inconclusive case
        return {
            "diagnosis": "Diagnosis: Inconclusive",
            "recommendation": "Recommendation: The combination of facts did not meet the minimum certainty threshold (CF > 10%). Review symptoms carefully.",
            "certainty_factor": 0.0
        }

# Global instance initialization remains the same
KBS_ENGINE = InferenceEngine()

def get_initial_symptoms():
    # Helper to return symptom question mapping for the frontend
    return KBS_ENGINE.kb_data.get("questions", {})

def run_diagnosis(symptoms):
    return KBS_ENGINE.infer_diagnosis(symptoms)