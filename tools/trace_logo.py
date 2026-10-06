#!/usr/bin/env python3
"""Trace assets/rjp-logo.png (RGBA cut-out of the RJP logo) into assets/rjp-logo.svg.

Three colour layers (navy letters, orange and green flag swoosh) are extracted, smoothed, contoured and simplified.
Needs numpy, scipy, Pillow and contourpy (all ship with matplotlib). Run:  python3 tools/trace_logo.py
"""
import os, numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, binary_dilation, label
from contourpy import contour_generator

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets/rjp-logo.png"); OUT = os.path.join(ROOT, "assets/rjp-logo.svg")
UP = 4                       # work at 4x resolution so edges come out smooth
im = Image.open(SRC).convert("RGBA"); W, H = im.size
big = im.resize((W * UP, H * UP), Image.LANCZOS)
a = np.asarray(big).astype(float); rgb = a[..., :3]; opaque = a[..., 3] > 128
R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]
masks = {
    "navy":   opaque & (B > R + 25) & (B >= G) & (rgb.sum(-1) < 420),
    "orange": opaque & (R > 190) & (G > 90) & (G < 200) & (B < 130),
    "green":  opaque & (G > R + 20) & (G >= B - 10) & (R < 150),
}
# The Ashoka wheel inside the P: the poster has a white disc with a stray white square behind it. Fill that whole
# area solid navy and redraw the wheel as exact geometry (centre/radius measured from the cut-out).
WHEEL = (355.0, 63.3, 29.0)
yy, xx = np.mgrid[0:H * UP, 0:W * UP]
box = (xx >= 329 * UP) & (xx <= 386 * UP) & (yy >= 36 * UP) & (yy <= 92 * UP)
masks["navy"] = masks["navy"] | box
wheel = WHEEL
masks["navy"] = binary_dilation(masks["navy"], iterations=3)       # slight overlap so layers never leave hairline gaps
colours = {"navy": "#052877", "orange": "#f88a0e", "green": "#159d41"}

def rdp(pts, eps):
    """Douglas-Peucker on an (n,2) array, iterative."""
    keep = np.zeros(len(pts), bool); keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1: continue
        p, q = pts[i], pts[j]; d = q - p; n = np.hypot(*d)
        seg = pts[i + 1:j] - p
        dist = np.abs(seg[:, 0] * d[1] - seg[:, 1] * d[0]) / n if n else np.hypot(seg[:, 0], seg[:, 1])
        k = int(np.argmax(dist))
        if dist[k] > eps:
            keep[i + 1 + k] = True; stack += [(i, i + 1 + k), (i + 1 + k, j)]
    return pts[keep]

def area(p): x, y = p[:, 0], p[:, 1]; return abs(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1))) / 2

paths = []
for name in ("navy", "orange", "green"):
    z = gaussian_filter(masks[name].astype(float), 2.0)
    d = []
    for line in contour_generator(z=z).lines(0.5):
        pts = np.asarray(line)
        if len(pts) < 8 or area(pts) < 12 * UP * UP / 4: continue          # drop specks
        pts = rdp(pts[:-1] if np.allclose(pts[0], pts[-1]) else pts, 1.3) / UP
        d.append("M" + " ".join(f"{x:.2f},{y:.2f}" for x, y in pts) + "Z")
    paths.append(f'<path fill="{colours[name]}" fill-rule="evenodd" d="{"".join(d)}"/>')

if wheel:
    import math
    wx, wy, wr = wheel
    navy = colours["navy"]
    spokes = "".join(
        f'<line x1="{wx + 0.20*wr*math.cos(math.radians(i*15)):.2f}" y1="{wy + 0.20*wr*math.sin(math.radians(i*15)):.2f}" '
        f'x2="{wx + 0.80*wr*math.cos(math.radians(i*15)):.2f}" y2="{wy + 0.80*wr*math.sin(math.radians(i*15)):.2f}"/>' for i in range(24))
    paths.append(
        f'<g><circle cx="{wx:.2f}" cy="{wy:.2f}" r="{wr:.2f}" fill="#fff"/>'
        f'<circle cx="{wx:.2f}" cy="{wy:.2f}" r="{0.89*wr:.2f}" fill="none" stroke="{navy}" stroke-width="{0.09*wr:.2f}"/>'
        f'<g stroke="{navy}" stroke-width="{0.055*wr:.2f}" stroke-linecap="round">{spokes}</g>'
        f'<circle cx="{wx:.2f}" cy="{wy:.2f}" r="{0.17*wr:.2f}" fill="#fff"/>'
        f'<circle cx="{wx:.2f}" cy="{wy:.2f}" r="{0.13*wr:.2f}" fill="{navy}"/></g>')
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="RJP, Ravi Janatha Party">'
       + "".join(paths) + "</svg>\n")
open(OUT, "w", encoding="utf-8").write(svg)
print(f"wrote {OUT}: {len(svg)/1024:.1f} KB, {sum(p.count('M') for p in paths)} shapes")
