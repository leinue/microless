from flask import Flask
from redis import Redis, RedisError
import os
import socket
from flask import request
import json

# Connect to Redis
redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)

app = Flask(__name__)

@app.route("/")
def hello():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"

    html = "<h3>Hello {name}!</h3>" \
           "<b>Hostname:</b> {hostname}<br/>" \
           "<b>Visits:</b> {visits}"
    return html.format(name=os.getenv("NAME", "world"), hostname=socket.gethostname(), visits=visits)

@app.route('/fuck/<id>')
def fuck(id):
    html = 'fuck {name}'
    return html.format(name=id)

@app.route('/test', methods=['POST'])
def post():
    value = request.get_json(True)
    return json.dumps(value)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)