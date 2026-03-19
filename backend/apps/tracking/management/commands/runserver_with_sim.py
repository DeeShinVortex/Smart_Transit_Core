"""
Start Django server + bus simulator together.
Usage: python manage.py runserver_with_sim
"""

import subprocess
import sys
import os
import signal
import time
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Start Django runserver and bus simulator together"

    def add_arguments(self, parser):
        parser.add_argument("--sim-interval", type=float, default=3.0)

    def handle(self, *args, **options):
        interval = options["sim_interval"]
        python = sys.executable
        manage = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "..", "manage.py")
        manage = os.path.normpath(manage)

        self.stdout.write(self.style.SUCCESS("Starting Django server..."))
        server = subprocess.Popen(
            [python, manage, "runserver"],
            stdout=sys.stdout, stderr=sys.stderr,
        )

        # Give the server a moment to start
        time.sleep(5)

        self.stdout.write(self.style.SUCCESS("Starting bus simulator..."))
        simulator = subprocess.Popen(
            [python, manage, "simulate_buses", "--interval", str(interval)],
            stdout=sys.stdout, stderr=sys.stderr,
        )

        def shutdown(signum, frame):
            self.stdout.write("\nShutting down...")
            simulator.terminate()
            server.terminate()
            simulator.wait()
            server.wait()
            self.stdout.write(self.style.SUCCESS("Stopped."))
            sys.exit(0)

        signal.signal(signal.SIGINT, shutdown)
        signal.signal(signal.SIGTERM, shutdown)

        try:
            server.wait()
        except KeyboardInterrupt:
            shutdown(None, None)
