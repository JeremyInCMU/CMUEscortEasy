#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cmuescort.settings")
	try:
    		from django.core.management import execute_from_command_line
	except ImportError:

		try:
			import django
		except ImportError:
			raise ImportError(
				"Couldn't import Django, Are you sure it is installed and "
               			"available on your PYTHONPATH environment variable? Did you "
				"forget to activate a virtual environment?"
	   		)
	execute_from_command_line(sys.argv)
