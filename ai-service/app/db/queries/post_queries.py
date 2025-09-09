from sqlalchemy import text
from app.schemas.post import Post, Media

# Lấy post + media theo post_id
GET_POST_BY_ID = text("""
    SELECT p.id AS post_id,
           p.content,
           m.id AS media_id,
           m.type AS media_type,
           m.url AS media_url
    FROM posts p
    LEFT JOIN media m ON p.id = m."postId"
    WHERE p.id = :post_id
""")


def map_post_with_media(rows) -> Post:
    if not rows:
        return None
    
    first_row = rows[0]
    media_list = [
        Media(id=str(r.media_id), type=r.media_type, url=r.media_url)
        for r in rows if r.media_id
    ]
    return Post(
        id=str(first_row.post_id),
        content=first_row.content,
        media=media_list
    )