from app import app
from namespaces import *
import sys
from initdb import initdb

initdb()

if __name__ == '__main__':
    try:
        app.run(host='localhost', port=4000)
    except ImportError as e:
        print('ERROR:', e, file=sys.stderr)
        if sys.version_info < (3, 8):
            print('The backend requires Python 3.8 or later - you appear to be using Python {}.{}'.format(
                *sys.version_info), file=sys.stderr)
        else:
            print('A module required by the backend is missing.', file=sys.stderr)
            print('See the instructions in backend/README.md for installing the required modules.', file=sys.stderr)
            print('Ask in the chat if you can not fix this problem.', file=sys.stderr)
