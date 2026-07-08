"""MongoDB connection and index management."""

from motor.motor_asyncio import AsyncIOMotorClient

from config import DB_NAME, MONGO_URL

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


async def ensure_indexes() -> None:
    await db.reports.create_index("report_id", unique=True)
    # Daily rate-limit counters carry an expires_at set 2 days out; TTL
    # indexes reap them so these collections don't grow forever.
    await db.usage_daily.create_index("expires_at", expireAfterSeconds=0)
    await db.rate_limit_daily.create_index("expires_at", expireAfterSeconds=0)


def close() -> None:
    client.close()
