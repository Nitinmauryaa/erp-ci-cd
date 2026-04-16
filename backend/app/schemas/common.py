from math import ceil
from typing import Any


def paginated_response(data: list[Any], total: int, skip: int, limit: int) -> dict[str, Any]:
    page = (skip // limit) + 1 if limit else 1
    total_pages = ceil(total / limit) if limit else 1
    return {
        "data": data,
        "meta": {
            "total": total,
            "skip": skip,
            "limit": limit,
            "page": page,
            "total_pages": total_pages,
        },
    }
