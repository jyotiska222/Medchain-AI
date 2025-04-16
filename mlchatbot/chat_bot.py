from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import re
import spacy
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import language_tool_python
from autocorrect import Speller
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class MedicalChatbot:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.spell = Speller(lang='en')
        self.grammar_tool = language_tool_python.LanguageTool('en-US')
        self.symptom_df = None
        self.description_df = None
        self.precaution_df = None
        self.severity_df = None
        self.model = None
        self.le = LabelEncoder()
        self.symptoms_list = []
        self.symptom_index = {}
        self.disease_index = {}
        
    def load_and_clean_data(self):
        """Load and clean all the medical datasets"""
        # Load the datasets
        raw_symptom_df = pd.read_csv('dataset/disease_symptom.csv')
        self.description_df = pd.read_csv('dataset/symptom_description.csv', sep=',')
        self.precaution_df = pd.read_csv('dataset/symptom_precaution.csv', sep=',')
        self.severity_df = pd.read_csv('dataset/symptom_severity.csv')
        
        # Clean symptom data
        # First, extract all symptom columns
        max_symptoms = raw_symptom_df.shape[1] - 1  # Exclude disease column
        symptom_cols = [f'Symptom_{i}' for i in range(1, max_symptoms + 1)]
        
        # Create a cleaner version of the symptom dataset
        self.symptom_df = raw_symptom_df.copy()
        
        # Fill NA values
        self.symptom_df[symptom_cols] = self.symptom_df[symptom_cols].fillna(0)
        
        # Clean whitespace from symptom names (e.g., "dischromic _patches" → "dischromic_patches")
        for col in symptom_cols:
            if col in self.symptom_df.columns:
                self.symptom_df[col] = self.symptom_df[col].apply(
                    lambda x: re.sub(r'\s+', '_', x.strip()) if isinstance(x, str) else x
                )
        
        # Clean severity data
        self.severity_df['Symptom'] = self.severity_df['Symptom'].apply(
            lambda x: re.sub(r'\s+', '_', x.strip()) if isinstance(x, str) else x
        )
        
        # Create a list of all possible symptoms
        self.symptoms_list = list(self.severity_df['Symptom'].unique())
        
        # Create symptom to index mapping
        self.symptom_index = {symptom: index for index, symptom in enumerate(self.symptoms_list)}
        
        # Create disease to index mapping
        diseases = self.symptom_df['Disease'].unique()
        self.disease_index = {disease: index for index, disease in enumerate(diseases)}
        
        print(f"Data loaded and cleaned successfully.")
        print(f"Found {len(self.symptoms_list)} unique symptoms and {len(diseases)} unique diseases.")
        
    def create_feature_matrix(self):
        """Create a feature matrix for training with symptoms as features"""
        # Initialize data matrix with zeros
        X = np.zeros((len(self.symptom_df), len(self.symptoms_list)))
        y = np.zeros(len(self.symptom_df))
        
        # Fill in the feature matrix
        for i, row in self.symptom_df.iterrows():
            disease = row['Disease']
            y[i] = self.disease_index[disease]
            
            # Mark symptoms present in this disease instance
            for j in range(1, 18):  # Assuming max 17 symptoms
                col = f'Symptom_{j}'
                if col in row.index and row[col] != 0 and isinstance(row[col], str):
                    symptom = row[col]
                    if symptom in self.symptom_index:
                        X[i, self.symptom_index[symptom]] = 1
        
        # Encode the target variable
        y = self.le.fit_transform(y)
        
        return X, y
    
    def train_model(self):
        """Train the XGBoost model for disease prediction"""
        # Create feature matrix
        X, y = self.create_feature_matrix()
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Define XGBoost parameters
        params = {
            'objective': 'multi:softprob',
            'num_class': len(self.disease_index),
            'learning_rate': 0.1,
            'max_depth': 5,
            'n_estimators': 100,
            'eval_metric': 'mlogloss'
        }
        
        # Train the model
        self.model = xgb.XGBClassifier(**params)
        self.model.fit(X_train, y_train)
        
        # Evaluate the model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Model trained with accuracy: {accuracy:.4f}")
        print(classification_report(y_test, y_pred))
    
    def correct_grammar(self, text):
        """Correct grammar in user input"""
        # First correct spelling
        corrected_text = self.spell(text)
        
        # Then correct grammar
        matches = self.grammar_tool.check(corrected_text)
        corrected_text = language_tool_python.utils.correct(corrected_text, matches)
        
        return corrected_text
    
    def extract_symptoms(self, user_input):
        """Extract symptoms from user input using NLP"""
        # Correct grammar and spelling in user input
        cleaned_input = self.correct_grammar(user_input)
        
        # Process text with spaCy
        doc = self.nlp(cleaned_input)
        
        # Create a dictionary of symptom keywords and their corresponding symptom names
        symptom_keywords = self._build_symptom_keywords()
        
        # Extract potential symptom phrases
        identified_symptoms = set()
        
        # Check for direct symptom matches in the input
        for symptom, keywords in symptom_keywords.items():
            for keyword in keywords:
                if keyword.lower() in cleaned_input.lower():
                    identified_symptoms.add(symptom)
        
        # Use spaCy's entity recognition for medical terms
        for entity in doc.ents:
            if entity.label_ in ["SYMPTOM", "DISEASE", "CONDITION"]:
                # Try to match this entity with known symptoms
                entity_text = entity.text.lower()
                for symptom, keywords in symptom_keywords.items():
                    for keyword in keywords:
                        if self._calculate_similarity(entity_text, keyword) > 0.8:
                            identified_symptoms.add(symptom)
        
        # Extract phrases that might indicate symptoms
        # Look for key phrases like "I feel", "I have", "experiencing"
        symptom_phrases = []
        symptom_indicators = ["feel", "have", "experiencing", "suffering", "pain", "ache", "sore", "hurt"]
        
        for token in doc:
            if token.text.lower() in symptom_indicators:
                # Get the subtree of this token
                phrase = " ".join([t.text for t in token.subtree])
                symptom_phrases.append(phrase)
        
        # Check for additional symptoms in extracted phrases
        for phrase in symptom_phrases:
            phrase_doc = self.nlp(phrase)
            for symptom, keywords in symptom_keywords.items():
                for keyword in keywords:
                    keyword_similarity = self._calculate_similarity(phrase.lower(), keyword)
                    if keyword_similarity > 0.7:
                        identified_symptoms.add(symptom)
        
        # Handle specific symptom mappings based on common descriptions
        symptom_mappings = {
            "tired": "fatigue",
            "breathless": "breathlessness",
            "short of breath": "breathlessness",
            "trouble breathing": "breathlessness",
            "dizzy": "dizziness",
            "headache": "headache",
            "burning when urinating": "burning_micturition",
            "burning sensation when peeing": "burning_micturition",
            "burning pee": "burning_micturition",
            "pain when urinating": "burning_micturition",
            "bad smelling urine": "foul_smell_of_urine",
            "urine smells bad": "foul_smell_of_urine"
        }
        
        for key, value in symptom_mappings.items():
            if key.lower() in cleaned_input.lower():
                for symptom in self.symptoms_list:
                    normalized_symptom = symptom.lower().replace("_", " ")
                    if value.lower() in normalized_symptom:
                        identified_symptoms.add(symptom)
        
        # Convert the set to a list
        identified_symptoms_list = list(identified_symptoms)
        
        # Check if we have at least two symptoms
        if len(identified_symptoms_list) < 2:
            # Try harder to find a second symptom
            for noun_chunk in doc.noun_chunks:
                chunk_text = noun_chunk.text.lower()
                
                # Skip chunks that are too short or common language
                if len(chunk_text) < 4:
                    continue
                
                # Check if this chunk may be a symptom
                for symptom in self.symptoms_list:
                    symptom_text = symptom.lower().replace("_", " ")
                    similarity = self._calculate_similarity(chunk_text, symptom_text)
                    
                    if similarity > 0.7 and symptom not in identified_symptoms_list:
                        identified_symptoms_list.append(symptom)
                        break
                
                if len(identified_symptoms_list) >= 2:
                    break
        
        return identified_symptoms_list, cleaned_input
    
    def _build_symptom_keywords(self):
        """Build a dictionary of symptom keywords for better matching"""
        symptom_keywords = {}
        
        for symptom in self.symptoms_list:
            # Convert symptom format (e.g., "burning_micturition" -> ["burning micturition", "burning", "micturition"])
            base_term = symptom.lower().replace("_", " ")
            terms = [base_term] + base_term.split()
            
            # Add alternative forms and common variations
            if "pain" in base_term:
                terms.append(base_term.replace("pain", "ache"))
            
            if "headache" in base_term:
                terms.extend(["head pain", "head ache", "migraine"])
                
            if "burning_micturition" == symptom:
                terms.extend(["burning when peeing", "pain when urinating", "painful urination"])
                
            if "breathlessness" == symptom:
                terms.extend(["short of breath", "difficulty breathing", "trouble breathing"])
                
            if "fatigue" == symptom:
                terms.extend(["tired", "exhausted", "low energy", "no energy"])
                
            if "foul_smell_of_urine" == symptom:
                terms.extend(["smelly urine", "urine odor", "smelly pee", "bad smell urine"])
            
            # Add more symptom variations as needed
            
            symptom_keywords[symptom] = terms
            
        return symptom_keywords
    
    def _calculate_similarity(self, text1, text2):
        """Calculate a simple similarity score between two texts"""
        # Simple implementation - just check word overlap
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 or not words2:
            return 0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union)
    
    def get_disease_probability(self, symptoms):
        """Predict disease probabilities based on symptoms"""
        # Create feature vector
        input_vector = np.zeros(len(self.symptoms_list))
        for symptom in symptoms:
            if symptom in self.symptom_index:
                input_vector[self.symptom_index[symptom]] = 1
        
        # Get probability predictions
        probabilities = self.model.predict_proba([input_vector])[0]
        
        # Create list of (disease, probability) tuples
        disease_probs = []
        for i, prob in enumerate(probabilities):
            if prob > 0.01:  # Only include diseases with >1% probability
                disease_idx = self.le.inverse_transform([i])[0]
                disease_name = list(self.disease_index.keys())[list(self.disease_index.values()).index(disease_idx)]
                disease_probs.append((disease_name, prob * 100))  # Convert to percentage
        
        # Sort by probability (descending)
        disease_probs.sort(key=lambda x: x[1], reverse=True)
        
        return disease_probs
    
    def get_disease_description(self, disease):
        """Get description for a disease"""
        description = "No description available."
        
        if disease in self.description_df['Disease'].values:
            description = self.description_df[self.description_df['Disease'] == disease]['Description'].values[0]
        
        return description
    
    def get_disease_precautions(self, disease):
        """Get precautions for a disease"""
        precautions = []
        
        if disease in self.precaution_df['Disease'].values:
            precaution_row = self.precaution_df[self.precaution_df['Disease'] == disease]
            for i in range(1, 5):
                precaution = precaution_row[f'Precaution_{i}'].values[0]
                if isinstance(precaution, str) and precaution.strip():
                    precautions.append(precaution)
        
        if not precautions:
            precautions = ["No specific precautions available."]
            
        return precautions
    
    def generate_response(self, user_input):
        """Generate a response based on user symptoms"""
        # Extract symptoms from user input
        symptoms, corrected_input = self.extract_symptoms(user_input)
        
        if not symptoms:
            return "I couldn't identify any specific symptoms from your description. Could you please describe your symptoms more clearly? For example: fever, cough, headache, etc."
        
        # Ensure we have at least 2 symptoms for more accurate prediction
        if len(symptoms) < 2:
            return f"I identified the symptom: {symptoms[0]}. To provide a more accurate assessment, could you please describe any other symptoms you're experiencing?"
        
        # Get disease probabilities
        disease_probs = self.get_disease_probability(symptoms)
        
        if not disease_probs:
            return "Based on the symptoms you've described, I couldn't determine any likely conditions. Please provide more details about your symptoms."
        
        # Format response
        # response = f"Based on the symptoms you described ({', '.join(symptoms)}), here are the possible conditions:\n\n"
        response = f"Based on the symptoms you described ({corrected_input}), here are the possible conditions:\n\n"
        
        for i, (disease, probability) in enumerate(disease_probs[:3], 1):  # Show top 3 diseases
            description = self.get_disease_description(disease)
            precautions = self.get_disease_precautions(disease)
            
            response += f"{i}. {disease} ({probability:.1f}%)\n"
            response += f"   Description: {description}\n"
            response += f"   Precautions: {', '.join(precautions)}\n\n"
        
        response += "Note: This is not a substitute for professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment."
        
        return response

# Initialize the chatbot
chatbot = MedicalChatbot()
print("Loading medical data...")
chatbot.load_and_clean_data()
print("Training disease prediction model...")
chatbot.train_model()
print("Medical Diagnostic Chatbot is ready!")

@app.route('/api/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    user_input = data.get('message', '')
    
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        response = chatbot.generate_response(user_input)
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": "An error occurred processing your request"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)