# import asyncio
# import json
# import aio_pika
# from aio_pika import connect_robust, Message, IncomingMessage, ExchangeType
# from app.core.config import settings
# from app.core.database import DBWhSessionLocal
# from app.services.graph_heuristics import GraphHeuristicsService

# RABBITMQ_URL = f"amqp://{settings.RABBITMQ_USER}:{settings.RABBITMQ_PASS}@{settings.RABBITMQ_HOST}:{settings.RABBITMQ_PORT}"
# QUEUE_NAME = settings.QUEUE_NAME


# async def on_message(message: IncomingMessage):
#     print("aio_pika version:", aio_pika.__version__)

#     async with message.process():
#         try:
#             payload = json.loads(message.body.decode())
#         except json.JSONDecodeError:
#             print("[Consumer] Failed to decode message body:", message.body)
#             return

#         event = payload.get("pattern")
#         data = payload.get("data", {})
#         user_ids = data.get("userIds", [])
#         algorithm = data.get("algorithm", "graph_heuristics")
#         top_n = data.get("topN", 10)

#         if event != "sync-user-recommendations":
#             print(f"[Consumer] Ignored event {event}")
#             return

#         results = {}

#         for user_id in user_ids:
#             print(f"[Consumer] Processing sync for user {user_id} with {algorithm}")
#             db = DBWhSessionLocal()
#             service = GraphHeuristicsService(db)

#             if algorithm == "graph_heuristics":
#                 recs = service.generate_recommendations(user_id, top_n)
#             elif algorithm == "common_neighbors":
#                 recs = service.get_common_neighbors_recommendations(user_id, top_n)
#             elif algorithm == "friend_of_friends":
#                 recs = service.get_friend_of_friends_recommendations(user_id, top_n)
#             elif algorithm == "jaccard":
#                 recs = service.get_jaccard_recommendations(user_id, top_n)
#             else:
#                 print(f"[Consumer] Invalid algorithm: {algorithm}")
#                 recs = []

#             results[user_id] = recs
#             db.close()

#         print("[Consumer] Sending reply:", results)

#         # Reply nếu có reply_to
#         if message.reply_to:
#             # Declare exchange tạm thời là direct exchange
#             exchange = await message.channel.declare_exchange(
#                 name="",  # default exchange
#                 type=ExchangeType.DIRECT
#             )
#             await exchange.publish(
#                 Message(
#                     body=json.dumps(results).encode(),
#                     correlation_id=message.correlation_id
#                 ),
#                 routing_key=message.reply_to
#             )




# async def main():
#     # Kết nối robust
#     connection = await connect_robust(RABBITMQ_URL)
#     channel = await connection.channel()

#     # Declare queue durable
#     queue = await channel.declare_queue(QUEUE_NAME, durable=True)

#     print(f"[Consumer] Waiting for messages in {QUEUE_NAME}...")
#     print("[Consumer] Connected to:", RABBITMQ_URL)

#     # Consume messages
#     await queue.consume(on_message)
#     return connection


# if __name__ == "__main__":
#     loop = asyncio.get_event_loop()
#     connection = loop.run_until_complete(main())

#     try:
#         loop.run_forever()
#     finally:
#         loop.run_until_complete(connection.close())
