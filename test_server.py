#!/usr/bin/env python3
"""
Test Server for Health Tracker Frontend Tests
Serves the frontend tests and handles report file saving
"""

import http.server
import socketserver
import urllib.parse
import os
import json
from datetime import datetime
import cgi
import io

class TestServer(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/save-report':
            self.handle_save_report()
        else:
            self.send_error(404, "Not found")
    
    def handle_save_report(self):
        try:
            # Parse the multipart form data
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST'}
            )
            
            # Get the report file
            if 'report' in form:
                report_file = form['report']
                filename = report_file.filename
                
                # Ensure reports directory exists
                reports_dir = 'reports'
                if not os.path.exists(reports_dir):
                    os.makedirs(reports_dir)
                
                # Save the file
                filepath = os.path.join(reports_dir, filename)
                with open(filepath, 'wb') as f:
                    f.write(report_file.file.read())
                
                print(f"✅ Report saved: {filepath}")
                
                # Send success response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'status': 'success', 'file': filepath}
                self.wfile.write(json.dumps(response).encode())
            else:
                self.send_error(400, "No report file provided")
                
        except Exception as e:
            print(f"❌ Error saving report: {e}")
            self.send_error(500, f"Error saving report: {str(e)}")
    
    def end_headers(self):
        # Add CORS headers for cross-origin requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.end_headers()

def main():
    PORT = 8000
    
    # Change to the project directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Create reports directory if it doesn't exist
    if not os.path.exists('reports'):
        os.makedirs('reports')
        print("📁 Created reports directory")
    
    with socketserver.TCPServer(("", PORT), TestServer) as httpd:
        print(f"🚀 Test server running on http://localhost:{PORT}")
        print(f"📁 Reports will be saved to: {os.path.abspath('reports')}")
        print("📋 Available test pages:")
        print("   - http://localhost:8000/tests/test_frontend_integration.html")
        print("   - http://localhost:8000/tests/test_api_endpoints_crud.html")
        print("   - http://localhost:8000/tests/test_database_crud.html")
        print("\n⏹️  Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")

if __name__ == "__main__":
    main() 