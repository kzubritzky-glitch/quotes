def test_index_returns_200(client):
    resp = client.get("/")
    assert resp.status_code == 200


def test_analytics_page_returns_200(client):
    resp = client.get("/analytics")
    assert resp.status_code == 200


def test_heatmap_page_returns_200(client):
    resp = client.get("/heatmap")
    assert resp.status_code == 200


def test_heatmap_api_returns_grid(client):
    resp = client.get("/api/analytics/heatmap")
    assert resp.status_code == 200
    data = resp.get_json()
    assert "summary" in data
    assert "current_streak_days" in data["summary"]
    assert "longest_streak_days" in data["summary"]
    assert "total_completions" in data["summary"]
    assert "total_activities" in data["summary"]
    assert "active_days" in data["summary"]
    assert "peak_activity" in data["summary"]
    assert "weeks" in data
    assert len(data["weeks"]) == 12
    assert data["day_labels"] == ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    assert len(data["weeks"][0]["days"]) == 7
    for week in data["weeks"]:
        for day in week["days"]:
            assert 0 <= day["level"] <= 4
