#!/usr/bin/env python3
"""Rebuild src/data/sites.json from the public source endpoints.

Runs the four retrieval scripts in order, reads their raw output, applies the
elevation correction described in docs/PROVENANCE.md, recomputes the resolution
tiers, and writes the merged site file. No API key is needed.

Usage:
    python3 scripts/refresh_data.py

The retrieval scripts write to $COSMOCODE_RAW (default data/raw/). This script
sets that variable for them, so a plain `python3 scripts/refresh_data.py` is
all you need.

What is refreshed: temperature, temperature range, radiation, slope, soil,
pressure, daylight, precipitation, humidity, dust, isolation, elevation.
What is preserved: aqueous geochemistry (our estimate), completeness (a
per-site judgement), and the site names, countries and coordinates.
"""
import json
import math
import os
import subprocess
import sys
from datetime import date

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(REPO, "data", "raw")
SCRIPTS = ["fetch_power.py", "fetch_dem.py", "fetch_extra.py", "fetch_soil.py"]

LAPSE_RATE = 6.5        # deg C per km, free-air
PRESSURE_SCALE = 8400.0 # m, barometric scale height
SOLSTICE_DECL = 23.44   # deg, Earth axial tilt


def run(script):
    env = dict(os.environ)
    env["COSMOCODE_RAW"] = RAW
    print(f"--- {script} ---", flush=True)
    subprocess.run([sys.executable, os.path.join(REPO, "scripts", script)],
                   check=True, env=env)


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def write_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2)
        f.write("\n")


def correct_climate(t_grid, p_grid, h_grid, h_site):
    """Lapse-rate temperature and barometric pressure, per PROVENANCE.md."""
    t_site = t_grid - LAPSE_RATE * (h_site - h_grid) / 1000.0
    p_site = p_grid * math.exp(-(h_site - h_grid) / PRESSURE_SCALE)
    return t_site, p_site


def resolution_tier(gap_m):
    if gap_m <= 300:
        return 1.0
    if gap_m <= 1000:
        return 0.9
    if gap_m <= 2000:
        return 0.8
    return 0.7


def daylight_hours(lat):
    """Longest-day length from latitude, summer solstice solar geometry."""
    decl = math.radians(SOLSTICE_DECL if lat >= 0 else -SOLSTICE_DECL)
    lat_r = math.radians(lat)
    c = -math.tan(lat_r) * math.tan(decl)
    if c <= -1:
        return 24.0
    if c >= 1:
        return 0.0
    return 24.0 * math.acos(c) / math.pi


def merge(sites, power, dem, extra, soil):
    for site in sites:
        sid = site["id"]
        p = power[sid]
        d = dem[sid]
        e = extra[sid]
        s = soil.get(sid, {})

        h_grid = p["elevation_m"]
        h_site = d["elevation_m"]
        t_site, p_site = correct_climate(p["T2M"], p["PS"], h_grid, h_site)

        sand = s.get("sand")
        soil_pct = round(sand / 10.0, 1) if sand is not None else site["values"]["soil"]

        site["values"] = {
            "temperature": round(t_site, 2),
            "tempRange": round(p["diurnal_range"], 2),
            "radiation": round(e["cosmic_dose_usv_day"], 2),
            "slope": round(d["slope_deg"], 2),
            "soil": soil_pct,
            "pressure": round(p_site, 2),
            "daylight": round(daylight_hours(site["lat"]), 2),
            "precipitation": round(p["precip_mm_yr"], 1),
            "humidity": round(p["RH2M"], 2),
            "dust": round(e["aod_55"], 2),
            "isolation": round(e["nearest_city_km"], 1),
            "elevation": round(h_site, 1),
            # preserved: the one parameter we estimate by judgement
            "aqueous": site["values"]["aqueous"],
        }
        site["resolutionTier"] = resolution_tier(abs(h_site - h_grid))
    return sites


def main():
    os.makedirs(RAW, exist_ok=True)
    for script in SCRIPTS:
        run(script)

    power = load_json(os.path.join(RAW, "power_raw.json"))
    dem = load_json(os.path.join(RAW, "dem_raw.json"))
    extra = load_json(os.path.join(RAW, "extra_raw.json"))
    soil = load_json(os.path.join(RAW, "soil_raw.json"))

    sites_path = os.path.join(REPO, "src", "data", "sites.json")
    sites = load_json(sites_path)
    sites = merge(sites, power, dem, extra, soil)
    write_json(sites_path, sites)

    config_path = os.path.join(REPO, "src", "data", "config.json")
    config = load_json(config_path)
    config["retrieval"]["retrievedOn"] = date.today().isoformat()
    write_json(config_path, config)

    write_json(os.path.join(RAW, "manifest.json"), {
        "retrievedOn": date.today().isoformat(),
        "sites": len(sites),
        "scripts": SCRIPTS,
    })

    print(f"\nrefreshed {len(sites)} sites -> src/data/sites.json")
    print(f"raw responses -> data/raw/")
    print(f"retrieval date -> {config['retrieval']['retrievedOn']}")


if __name__ == "__main__":
    main()
