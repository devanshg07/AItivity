# Image Analysis Backend

This is a FastAPI backend service for analyzing images to extract text and understand their meaning using OpenAI's GPT-4 Vision model.

## Features

- Accepts image uploads via HTTP POST
- Extracts text from images using OCR-like capabilities
- Describes the meaning and content of images
- Returns analysis in JSON format

## Requirements

- Python 3.8+
- OpenAI API key

## Installation

1. Clone or navigate to the backend directory
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set your OpenAI API key as an environment variable:
   ```
   export OPENAI_API_KEY="your-api-key-here"
   ```
   On Windows:
   ```
   set OPENAI_API_KEY=your-api-key-here
   ```

## Running the Server

Run the FastAPI server with:
```
python main.py
```

Or using uvicorn directly:
```
uvicorn main:app --reload
```

The server will start on `http://localhost:8000`

## API Usage

### Analyze Image

**Endpoint:** `POST /analyze-image`

**Description:** Upload an image file to analyze its text and meaning.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `file` (image file)

**Example using curl:**
```
curl -X POST "http://localhost:8000/analyze-image" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@path/to/your/image.jpg"
```

**Response:**
```json
{
  "analysis": "Extracted text: 'Hello World'\n\nMeaning: This is an image containing the text 'Hello World' on a white background, appearing to be a simple greeting or test image."
}
```

## Troubleshooting

- **OpenAI API Key Error:** Ensure the `OPENAI_API_KEY` environment variable is set correctly.
- **Image Upload Issues:** Make sure the file is a valid image format (JPEG, PNG, etc.).
- **CORS Errors:** If accessing from a frontend, ensure CORS is properly configured (currently set to allow all origins).

## Dependencies

- FastAPI: Web framework
- Uvicorn: ASGI server
- OpenAI: For AI-powered image analysis
- python-multipart: For handling file uploads