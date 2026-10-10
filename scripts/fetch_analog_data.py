#!/usr/bin/env python3
"""Starter script: pull a single point's climatology from NASA POWER.

This is a starting point only. The site values in src/data/sites.json are
curated sample data (see docs/PROVENANCE.md); this script shows how a live
pull would work for one parameter set.

Usage:
    python3 scripts/fetch_analog_data.py LAT LON

Example:
    python3 scripts/fetch_analog_data.py -22.91 -68.20

Requires: Python 3.8+, no third-party packages (uses urllib).
API docs: https://power.larc.nasa.gov/docs/services/api/
"""
import json
import sys
import urllib.request

POWER_URL = "https://power.larc.nasa.gov/api/temporal/climatology/point"

PARAMETERS = ["T2M", "T2M_MAX", "T2M_MIN", "PRECTOTCORR", "RH2M", "ALLSKY_SFC_SW_DWN"]


def fetch(lat, lon):
    query = "&".join(
        [
            "parameters=" + ",".join(PARAMETERS),
            f"latitude={lat}",
            f"longitude={lon}",
            "format=JSON",
            "community=RE",
        ]
    )
    url = f"{POWER_URL}?{query}"
    with urllib.request.urlopen(url, timeout=60) as resp:
        return json.load(resp)


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    lat, lon = float(sys.argv[1]), float(sys.argv[2])
    data = fetch(lat, lon)
    props = data["properties"]["parameter"]
    print(
        json.dumps(
            {
                "latitude": lat,
                "longitude": lon,
                "source": "NASA POWER climatology (1991-2020)",
                "t2m_mean_c": round(props["T2M"]["ANN"], 2),
                "t2m_max_c": round(props["T2M_MAX"]["ANN"], 2),
                "t2m_min_c": round(props["T2M_MIN"]["ANN"], 2),
                "precipitation_mm_yr": round(props["PRECTOTCORR"]["ANN"], 1),
                "rh2m_percent": round(props["RH2M"]["ANN"], 1),
                "sunshine_w_m2": round(props["ALLSKY_SFC_SW_DWN"]["ANN"], 1),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
