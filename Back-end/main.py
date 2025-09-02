from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os

# Initialize
app = FastAPI()
api_key = os.getenv("OPENAI_API_KEY", "fake-key")
client = OpenAI(api_key=api_key)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # only frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    email: str
    style: str = "professional"

class EmailResponse(BaseModel):
    feedback: str
    rewritten: str

@app.post("/review-email", response_model=EmailResponse)
def review_email(request: EmailRequest):
    prompt = f"""
    You are an assistant that reviews emails.
    1. Give constructive feedback on tone, clarity, and professionalism.
    2. Rewrite the email in a '{request.style}' style.

    Email:
    {request.email}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # fast + cost-effective
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    output = response.choices[0].message.content

    # Simple split: expect feedback first, then rewrite
    if "Rewrite:" in output:
        feedback, rewritten = output.split("Rewrite:", 1)
    else:
        feedback, rewritten = output, ""

    return EmailResponse(
        feedback=feedback.strip(),
        rewritten=rewritten.strip()
    )
