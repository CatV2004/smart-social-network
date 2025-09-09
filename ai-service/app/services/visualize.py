from pyvis.network import Network
import networkx as nx

def visualize_graph_pyvis(graph: nx.DiGraph, output_file="graph.html"):
    """
    Trực quan hóa graph bằng PyVis, tạo file HTML có thể zoom/pan.
    """
    # Khởi tạo PyVis network (directed)
    net = Network(
        height="750px",
        width="100%",
        bgcolor="#ffffff",
        font_color="black",
        directed=True
    )

    # Add nodes (user info)
    for node, attrs in graph.nodes(data=True):
        label = attrs.get("username", node)
        title = f"""
        <b>{attrs.get("first_name", "")} {attrs.get("last_name", "")}</b><br>
        Username: {attrs.get("username", "")}<br>
        Id: {node}<br>
        Location: {attrs.get("location", "")}<br>
        Bio: {attrs.get("bio", "")}
        """
        net.add_node(
            node,
            label=label,
            title=title,
            shape="dot",
            size=12,
            color="skyblue"
        )

    # Add edges (follows)
    for source, target, attrs in graph.edges(data=True):
        net.add_edge(
            source,
            target,
            title=f"Followed at {attrs.get('created_at')}"
        )

    # Lưu ra file HTML
    net.write_html(output_file)
    print(f"✅ Graph saved to {output_file}, mở file này trong browser để xem.")
