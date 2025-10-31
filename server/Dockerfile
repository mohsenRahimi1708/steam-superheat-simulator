FROM python:3.11-slim

WORKDIR /app

# توجه: فایل‌ها در مسیر server/ هستند، پس باید آن‌ها را از آنجا کپی کنیم
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server/app.py .

EXPOSE 8080

CMD ["python", "app.py"]
