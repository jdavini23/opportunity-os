"""MongoDB connection and index management."""

from motor.motor_asyncio import AsyncIOMotorClient

from config import MONGO_URL, DB_NAME

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


async def ensure_indexes() -> None:
    await db.reports.create_index("report_id", unique=True)


def close() -> None:
    client.close()
