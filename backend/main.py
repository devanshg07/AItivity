from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import openai
import base64
import os
from typing import Dict, Any

app = FastAPI(title="Image Analysis Backend", description="API for analyzing images to extract text and meaning")

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set")

@app.post("/analyze-image", response_model=Dict[str, Any])
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze an uploaded image to extract text and describe its meaning.
    
    - **file**: Image file to analyze (JPEG, PNG, etc.)
    
    Returns a dictionary with the analysis result.
    """
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read file contents
        contents = await file.read()
        
        # Encode to base64
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        # Create data URL
        data_url = f"data:{file.content_type};base64,{base64_image}"
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4o",  # Use GPT-4o for vision capabilities
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Extract any text from this image and describe the overall meaning or content of the image. Be minimal."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )
        
        # Extract the response
        result = response.choices[0].message.content
        
        return {"analysis": result}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Image Analysis Backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)