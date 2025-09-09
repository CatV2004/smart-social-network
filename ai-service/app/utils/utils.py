from typing import List, Tuple

def normalize_db_rows(rows: List[Tuple]) -> List[Tuple[str, str, int]]:
    """
    Chuyển các giá trị UUID trong các row từ DB sang string
    Args:
        rows: List of tuples, mỗi tuple dạng (source_id, target_id, label)
    Returns:
        List of tuples với source_id và target_id là string
    """
    return [(str(row[0]), str(row[1]), row[2]) for row in rows]
