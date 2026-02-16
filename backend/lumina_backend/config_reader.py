"""
Configuration reader for config.properties file.
Reads Java-style .properties files for Django configuration.
"""
import os
from configparser import ConfigParser
from pathlib import Path


def read_config(config_path=None):
    """Read config.properties and return a dict of settings."""
    if config_path is None:
        config_path = Path(__file__).resolve().parent.parent / 'config.properties'

    config = {}
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Configuration file not found: {config_path}")

    with open(config_path, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, value = line.split('=', 1)
                config[key.strip()] = value.strip()

    return config


# Global config instance
_config = None


def get_config():
    """Get global config instance (lazy-loaded singleton)."""
    global _config
    if _config is None:
        _config = read_config()
    return _config
