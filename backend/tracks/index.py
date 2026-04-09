"""
Управление аудиотреками: загрузка MP3 в S3 и получение списка треков.
"""
import os
import json
import base64
import boto3
from botocore.exceptions import ClientError

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}

    # GET /tracks — список треков
    if method == 'GET':
        s3 = get_s3()
        try:
            response = s3.list_objects_v2(Bucket='files', Prefix='tracks/')
            items = []
            for obj in response.get('Contents', []):
                key = obj['Key']
                if not key.endswith('.mp3') and not key.endswith('.wav') and not key.endswith('.ogg'):
                    continue
                name = key.replace('tracks/', '', 1)
                cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
                items.append({
                    'key': key,
                    'name': name,
                    'url': cdn_url,
                    'size': obj['Size'],
                })
            return {
                'statusCode': 200,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'tracks': items}),
            }
        except ClientError as e:
            return {
                'statusCode': 500,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': str(e)}),
            }

    # POST /tracks — загрузка трека (base64)
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        filename = body.get('filename', 'track.mp3')
        data_b64 = body.get('data', '')
        mood = body.get('mood', 'general')

        if not data_b64:
            return {
                'statusCode': 400,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Нет данных файла'}),
            }

        audio_data = base64.b64decode(data_b64)
        ext = filename.rsplit('.', 1)[-1].lower()
        content_types = {'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg'}
        content_type = content_types.get(ext, 'audio/mpeg')

        safe_name = filename.replace(' ', '_')
        key = f"tracks/{mood}/{safe_name}"

        s3 = get_s3()
        s3.put_object(
            Bucket='files',
            Key=key,
            Body=audio_data,
            ContentType=content_type,
        )

        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'url': cdn_url, 'key': key, 'name': safe_name}),
        }

    # DELETE /tracks?key=tracks/mood/file.mp3
    if method == 'DELETE':
        key = params.get('key', '')
        if not key or not key.startswith('tracks/'):
            return {
                'statusCode': 400,
                'headers': {**CORS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Неверный ключ'}),
            }
        s3 = get_s3()
        s3.delete_object(Bucket='files', Key=key)
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True}),
        }

    return {
        'statusCode': 405,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Method not allowed'}),
    }
