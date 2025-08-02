#!/bin/bash

echo "🚀 Starting Health Tracker Test Server..."
echo ""
echo "This server will:"
echo "- Serve frontend tests on http://localhost:8000"
echo "- Automatically save test reports to the reports/ directory"
echo "- Handle CORS for cross-origin requests"
echo ""
echo "Available test pages:"
echo "- http://localhost:8000/tests/test_frontend_integration.html"
echo "- http://localhost:8000/tests/test_api_endpoints_crud.html"
echo "- http://localhost:8000/tests/test_database_crud.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 test_server.py 