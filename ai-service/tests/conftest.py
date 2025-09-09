import pytest
import networkx as nx
from unittest.mock import Mock
from app.services.graph_heuristics import GraphHeuristicsService
from sqlalchemy.orm import Session
from datetime import datetime

@pytest.fixture
def mock_db():
    return Mock(spec=Session)

@pytest.fixture
def service(mock_db):
    return GraphHeuristicsService(mock_db)

@pytest.fixture
def sample_graph():
    """Tạo một đồ thị mẫu để testing"""
    graph = nx.DiGraph()

    graph.add_node("user1", username="user1", first_name="John", last_name="Doe", 
                  bio="Developer", location="Hanoi")
    graph.add_node("user2", username="user2", first_name="Jane", last_name="Smith", 
                  bio="Designer", location="HCMC")
    graph.add_node("user3", username="user3", first_name="Bob", last_name="Johnson", 
                  bio="Manager", location="Danang")
    graph.add_node("user4", username="user4", first_name="Alice", last_name="Brown", 
                  bio="Engineer", location="Hanoi")

    graph.add_edge("user1", "user2", created_at=datetime.now())
    graph.add_edge("user1", "user3", created_at=datetime.now())
    graph.add_edge("user2", "user3", created_at=datetime.now())
    graph.add_edge("user3", "user4", created_at=datetime.now())

    return graph
