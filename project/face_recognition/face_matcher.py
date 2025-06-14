#!/usr/bin/env python3
"""
Face Recognition Script for Online Voting System
This script compares two face images and returns a match score
"""

import cv2
import face_recognition
import numpy as np
import sys
import json
import base64
from io import BytesIO
from PIL import Image

def base64_to_image(base64_string):
    """Convert base64 string to OpenCV image"""
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        
        # Convert to PIL Image
        pil_image = Image.open(BytesIO(image_data))
        
        # Convert to RGB (face_recognition requires RGB)
        rgb_image = np.array(pil_image.convert('RGB'))
        
        return rgb_image
    except Exception as e:
        print(f"Error converting base64 to image: {e}")
        return None

def extract_face_encoding(image):
    """Extract face encoding from image"""
    try:
        # Find face locations
        face_locations = face_recognition.face_locations(image)
        
        if len(face_locations) == 0:
            return None
        
        # Get face encodings
        face_encodings = face_recognition.face_encodings(image, face_locations)
        
        if len(face_encodings) == 0:
            return None
        
        # Return the first face encoding
        return face_encodings[0]
    
    except Exception as e:
        print(f"Error extracting face encoding: {e}")
        return None

def compare_faces(stored_face_b64, live_face_b64, tolerance=0.6):
    """Compare two face images and return match result"""
    try:
        # Convert base64 images to OpenCV format
        stored_image = base64_to_image(stored_face_b64)
        live_image = base64_to_image(live_face_b64)
        
        if stored_image is None or live_image is None:
            return {
                "success": False,
                "message": "Failed to process images",
                "match": False,
                "confidence": 0.0
            }
        
        # Extract face encodings
        stored_encoding = extract_face_encoding(stored_image)
        live_encoding = extract_face_encoding(live_image)
        
        if stored_encoding is None:
            return {
                "success": False,
                "message": "No face detected in stored image",
                "match": False,
                "confidence": 0.0
            }
        
        if live_encoding is None:
            return {
                "success": False,
                "message": "No face detected in live image",
                "match": False,
                "confidence": 0.0
            }
        
        # Compare faces
        face_distances = face_recognition.face_distance([stored_encoding], live_encoding)
        face_distance = face_distances[0]
        
        # Calculate confidence (inverse of distance)
        confidence = max(0, (1 - face_distance) * 100)
        
        # Determine if faces match
        is_match = face_distance <= tolerance
        
        return {
            "success": True,
            "match": is_match,
            "confidence": round(confidence, 2),
            "distance": round(face_distance, 4),
            "message": "Face comparison completed successfully"
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Error during face comparison: {str(e)}",
            "match": False,
            "confidence": 0.0
        }

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) != 3:
        print(json.dumps({
            "success": False,
            "message": "Usage: python face_matcher.py <stored_face_b64> <live_face_b64>",
            "match": False,
            "confidence": 0.0
        }))
        sys.exit(1)
    
    stored_face_b64 = sys.argv[1]
    live_face_b64 = sys.argv[2]
    
    result = compare_faces(stored_face_b64, live_face_b64)
    print(json.dumps(result))

if __name__ == "__main__":
    main()