#!/usr/bin/python
import os
import sys

#hack to make sure we can load wsgi.py as a module in this class
sys.path.insert(0, os.path.dirname(__file__))

# virtenv = os.environ['OPENSHIFT_PYTHON_DIR'] + '/virtenv/'
# virtualenv = os.path.join(virtenv, 'bin/activate_this.py')
# try:
#     execfile(virtualenv, dict(__file__=virtualenv))
# except IOError:
#     print >>sys.sstderr, 'Failed to get into virtualenv'
#
# IMPORTANT: Put any additional includes below this line.  If placed above this
# line, it's possible required libraries won't be in your searchable path
#
import wsgi
from cherrypy import wsgiserver

server = wsgiserver.CherryPyWSGIServer(('0.0.0.0', 8080), wsgi.application)
server.start()
