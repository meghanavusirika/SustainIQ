import sys
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
text = sys.argv[1]
result = classifier(text)[0]
print(f"{result['label']} {result['score']}") 