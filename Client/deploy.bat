@echo off
SET PROJECT_ID=%1

call gcloud config set project %PROJECT_ID%

call gcloud builds submit --config cloudbuild.yaml .
call gcloud run deploy codeclash-frontend --image gcr.io/%PROJECT_ID%/codeclash-frontend --platform managed --port 3000 --region europe-west1

