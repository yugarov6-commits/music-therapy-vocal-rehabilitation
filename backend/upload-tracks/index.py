import os
import json
import boto3
import urllib.request

TRACKS = [
    {
        "key": "tracks/meditation/meditation-impromptu.mp3",
        "url": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2001.mp3",
        "title": "Meditation Impromptu",
        "mood": "Медитация",
    },
    {
        "key": "tracks/relaxing/relaxing-piano.mp3",
        "url": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Relaxing%20Piano%20Music.mp3",
        "title": "Relaxing Piano",
        "mood": "Расслабление",
    },
    {
        "key": "tracks/healing/healing.mp3",
        "url": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Healing.mp3",
        "title": "Healing",
        "mood": "Восстановление",
    },
    {
        "key": "tracks/focus/slow-burn.mp3",
        "url": "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Slow%20Burn.mp3",
        "title": "Slow Burn",
        "mood": "Концентрация",
    },
]

def handler(event: dict, context) -> dict:
    """Скачивает треки с incompetech.com и загружает их в S3 CDN проекта."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}, "body": ""}

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

    results = []
    for track in TRACKS:
        try:
            req = urllib.request.Request(track["url"], headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            s3.put_object(
                Bucket="files",
                Key=track["key"],
                Body=data,
                ContentType="audio/mpeg",
            )
            cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{track['key']}"
            results.append({"key": track["key"], "cdn_url": cdn_url, "mood": track["mood"], "title": track["title"], "status": "ok"})
        except Exception as e:
            results.append({"key": track["key"], "status": "error", "error": str(e)})

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
        "body": json.dumps({"tracks": results}),
    }