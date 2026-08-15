import boto3
from dotenv import load_dotenv
import os

load_dotenv()

Bucket_name = os.getenv("BUCKET_NAME")
s3_client = boto3.client("s3")
