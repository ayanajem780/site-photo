"""Construit hero-photos.js : la liste de toutes les photos du site pour le diaporama de l'accueil.
Relancer ce script quand on ajoute des albums : python3 hero_list.py /chemin/vers/site-photo
"""
import re, sys, os, glob, json
from PIL import Image

ROOT = sys.argv[1]
RUBRIQUES = {"airbnb": "Airbnb", "portraits": "People", "produits": "Products", "maghreb": "Maghreb", "anza": "Anza", "turath": "Turath Ummati"}

paysage, portrait, vus = [], [], set()
for page in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    nom = os.path.basename(page)
    cle = nom.split("-")[0].replace(".html", "")
    if cle not in RUBRIQUES or nom in ("airbnb.html", "portraits.html", "produits.html", "maghreb.html", "turath-ummati.html"):
        continue
    h = open(page, encoding="utf-8").read()
    titre = re.search(r"<h1[^>]*>(.*?)</h1>", h, re.S)
    titre = re.sub(r"<[^>]+>", "", titre.group(1)).strip() if titre else ""
    if cle == "turath":
        titre = "Episode " + nom[9]
    legende = f"{RUBRIQUES[cle]} · {titre}" if titre and cle != "anza" else RUBRIQUES[cle]
    for src in re.findall(r'data-full="([^"]+\.jpg)"', h):
        if src in vus or not os.path.exists(os.path.join(ROOT, src)):
            continue
        vus.add(src)
        w, hh = Image.open(os.path.join(ROOT, src)).size
        e = {"s": src, "l": nom, "t": legende}
        (paysage if w / hh > 1.15 else portrait if hh / w > 1.1 else paysage).append(e)

js = ("// Liste generee automatiquement : toutes les photos du site pour le diaporama de l'accueil.\n"
      "window.HERO_PHOTOS = " + json.dumps({"paysage": paysage, "portrait": portrait}, ensure_ascii=False, separators=(",", ":")) + ";\n")
open(os.path.join(ROOT, "hero-photos.js"), "w", encoding="utf-8").write(js)
print(len(paysage), "paysage,", len(portrait), "portrait,", len(js) // 1024, "KB")
