@echo off
SET PROJECT_ID=%1


call gcloud builds submit --config cloudbuild.yaml
call gcloud run deploy codeclash-backend --image gcr.io/%PROJECT_ID%/codeclash-backend --platform managed --port 5000 --region europe-west1
