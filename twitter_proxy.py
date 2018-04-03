#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" A proxy to twitter APIs.

File: twitter_proxy.py
Author: SpaceLis
Email: Wen.Li@tudelft.nl
GitHub: http://github.com/spacelis

"""
import os
import json
from time import sleep
from flask import Flask
from flask import Response
from flask import request
from flask import send_from_directory
from flask import redirect
from requests_oauthlib import OAuth1Session


def load_credentials(path):
    cred = {}
    for p in os.listdir(path):
        if not p.startswith('.'):
            with open(os.path.join(path, p)) as fin:
                cred[p] = fin.read()
    return cred

CRED_FILE = '/etc/credentials'
CRED = None
while CRED is None:
    try:
        CRED = load_credentials(CRED_FILE)
        sleep(3)
    except err:
        print 'Load credentials failed...'
        print err
        try:
            print os.listdir(CRED_FILE)
        except err:
            print err

twitter = OAuth1Session(CRED['client_key'],
                        CRED['client_secret'],
                        CRED['access_token'],
                        CRED['access_token_secret'])

app = Flask(__name__, static_folder='static', static_url_path='/static')


@app.route('/')
def index():
    return redirect('/examples/example.html')


@app.route('/tp/<path:path>', methods=['GET', 'POST'])
def reroute(path):
    """ Sign a message call
    :returns: @todo

    """
    if request.query_string:
        path = "/%s?%s" % (path, request.query_string)
    else:
        path = '/' + path
    r = twitter.get('https://api.twitter.com' + path)
    hdrs = dict(r.headers)
    del hdrs['content-encoding']
    return (r.text, r.status_code, hdrs.iteritems())


@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('./client', path)


if __name__ == "__main__":
    app.debug = True
    app.run(port=9090)
