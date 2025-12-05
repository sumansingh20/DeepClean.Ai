"""A-DFP Firewall Backend Application"""

__version__ = "1.0.0-beta"
__author__ = "Fraud Detection Team"
__description__ = "Autonomous Deepfake & Fraud Prevention Firewall"

from . import api, core, models, services, utils, workers

__all__ = [
    'api',
    'core',
    'models',
    'services',
    'utils',
    'workers',
]
