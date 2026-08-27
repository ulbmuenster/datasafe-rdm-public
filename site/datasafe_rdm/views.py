# Copyright (C) 2023-2026 University of Münster.
#
# datasafe-RDM is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.


"""Additional views."""
from flask import Blueprint, current_app, redirect, render_template, url_for
from flask_login import login_required
from werkzeug.local import LocalProxy

_datastore = LocalProxy(lambda: current_app.extensions["security"].datastore)

identifier_mappings = {
    "wwurdm/35928629581": "h726b-ek543",
    "wwurdm/75948666550": "0ngx5-gh817",
    "wwurdm/78968533530": "2ddc6-jh044",
    "wwurdm/78968568812": "f2xn9-w8y36",
    "wwurdm/78968682133": "bg6ks-kkg15",
    "wwurdm/73968606180": "x3fby-e7k49",
    "wwurdm/72998406764": "aq2zh-4tf87",
    "wwurdm/75948669649": "hbax6-a5g97",
    "wwurdm/74988584417": "r6srq-sw629",
    "wwurdm/60029249252": "pd03s-rat78",
    "wwurdm/76948473997": "e84vg-8sf18",
    "wwurdm/75948680490": "8r1re-k8g48",
    "wwurdm/79039496673": "7vg10-fvt06",
    "wwurdm/76998612805": "hesn4-4f471",
    "wwurdm/78968444790": "t23rr-6zb84",
    "wwurdm/37958749915": "2w0j4-jwm59",
    "wwurdm/62998544791": "4mj6a-tmf82",
    "wwurdm/63968753562": "bn1nn-f2402",
    "wwurdm/63968746649": "2njbw-b8z65",
    "wwurdm/63968571133": "mepva-6zv88",
    "wwurdm/64988204642": "ggbmx-7q076",
    "wwurdm/33958532203": "s9k3k-e6796",
    "wwurdm/68968382683": "zzjyz-50v52",
    "wwurdm/68968699934": "1r8v4-1fc66",
    "wwurdm/33958504780": "kas0c-mst53",
    "wwurdm/37958521051": "pt274-78m76",
    "wwurdm/33958632493": "sjr9f-kbj13",
    "wwurdm/67988719858": "a6ts1-jxn39",
    "wwurdm/33958636249": "29pfk-ypb43",
    "wwurdm/71019468307": "dc4t5-msh70",
    "wwurdm/38978670256": "8dqv2-mzh37",
    "wwurdm/38928504916": "98x25-w8624",
    "wwurdm/33958617644": "pv543-qg769",
    "wwurdm/63968754912": "5e3sh-esz34",
    "wwurdm/71019469246": "9hcmb-9ph53",
    "wwurdm/63968764345": "jpen0-nrp14",
    "wwurdm/63968570290": "jbk45-m9x89",
    "wwurdm/70079567714": "7f2na-fnx14",
    "wwurdm/67968365691": "h3k47-8mx98",
    "wwurdm/36908643773": "xja54-5pz33",
    "wwurdm/65958429999": "rjbwb-f3135",
    "wwurdm/37958496469": "x983d-f4y90",
    "wwurdm/33958595015": "wkj79-6ag54",
    "wwurdm/93938478756": "vnm9t-cnw11",
    "wwurdm/93938536912": "4kt3a-55029",
    "wwurdm/95998688265": "d046k-pry70",
    "wwurdm/82998470230": "0amte-22067",
    "wwurdm/90069684527": "m491z-2r996",
    "wwurdm/83918578489": "dbc87-jx349",
    "wwurdm/82099672942": "92f3b-mdw38",
    "wwurdm/96988508211": "4rhy7-sdn96",
    "wwurdm/96988513554": "4b7y5-fpn31",
    "wwurdm/82099666577": "rv74f-82k71",
    "wwurdm/84908727889": "a2q98-j0438",
    "wwurdm/90069693467": "fbrq2-g3a21",
    "wwurdm/99988638834": "dqfpt-6jp74",
    "wwurdm/82099677274": "5pzk7-evg92",
    "wwurdm/97908441334": "j5hx2-m0z44",
    "wwurdm/90069601390": "a1g7m-nqw50",
    "wwurdm/95908663199": "y0r3m-jfe91",
    "wwurdm/96988506319": "tpjrf-1zp37",
    "wwurdm/96988502814": "eynam-fcn15",
    "wwurdm/84908732863": "aw7dy-8c322",
    "wwurdm/96988504246": "158cm-gb392",
    "wwurdm/93938538320": "a5jc8-twc14",
    "wwurdm/96988603017": "gwn3p-q8z56",
    "wwurdm/94948598044": "h0kx4-5ee17",
    "wwurdm/53908748913": "nerwy-zsa03",
    "wwurdm/53968678663": "hhdqs-emb37",
    "wwurdm/50029415634": "2k4qq-hge41",
    "wwurdm/50029384120": "jmcyr-wfa33",
    "wwurdm/53968568099": "af7s3-4z020",
    "wwurdm/53968418440": "0kfh9-y2j74",
    "wwurdm/50009234781": "rr132-3q924",
    "wwurdm/56998485984": "az7w1-66e17",
    "wwurdm/53968396872": "2ky3r-sfv51",
    "wwurdm/56908632119": "4vmxf-n7875",
    "wwurdm/56998248270": "s2anb-e3967",
    "wwurdm/53968522862": "gcy1r-ftk84",
    "wwurdm/55938406306": "knknn-tfp06",
    "wwurdm/42069561530": "ejjt0-a2w14",
    "wwurdm/42069555041": "vkdzc-r0r69",
    "wwurdm/44968475110": "d48sk-mdw63",
    "wwurdm/47958418639": "phbw1-m6d43",
    "wwurdm/45938637339": "6ts2q-3y853",
    "wwurdm/44968484531": "grwqm-asc72",
    "wwurdm/46998597666": "jrhg3-n2227",
    "wwurdm/46938456136": "py9zt-v9597",
    "wwurdm/47908735104": "yw0kr-a4661",
    "wwurdm/40029637979": "2dm67-65k86",
    "wwurdm/47908780875": "apw0d-tbk03",
    "wwurdm/47978658333": "eywn0-jm595",
    "wwurdm/25089478804": "yn1fs-ryd78",
    "wwurdm/23958633877": "w7dxp-b6e31",
    "wwurdm/27978728738": "e50h3-shn93",
    "wwurdm/27968422969": "71hkn-jzm22",
    "wwurdm/27958756408": "z9prr-tvg97",
    "wwurdm/23958612312": "80tg7-vty50",
    "wwurdm/27958597979": "bjksb-mk469",
    "wwurdm/25089467440": "a7bxp-a4m52",
    "wwurdm/11019553640": "fg1xc-mj963",
    "wwurdm/10099465018": "9w4jd-3kc44",
    "wwurdm/16998503462": "p8cyb-yk361",
    "wwurdm/17918493172": "3n5hf-gqh09",
    "wwurdm/11019593160": "8w8pk-7tm10",
    "wwurdm/15089540285": "9vfpr-fae33",
    "wwurdm/19928408135": "2zhhf-bmr38",
    "wwurdm/19928420968": "re7pe-ajw63",
    "wwurdm/16998507738": "v3qr8-q4q46",
    "wwurdm/15089431751": "3728m-tha10",
    "wwurdm/17918519251": "h51ha-eb184",
    "wwurdm/17918491279": "8a9nc-d3f70",
    "wwurdm/10199752893": "k1cr7-vy859",
    "wwurdm/04029598474": "jka3g-6es06",
    "wwurdm/06998377187": "h586d-m7h44",
    "wwurdm/06908438146": "2k76h-6x617",
    "wwurdm/06908463376": "3v3ja-seb91",
    "wwurdm/00069499438": "pc6vt-0hm62",
    "wwurdm/06978724150": "qh0jp-m0y06",
    "wwurdm/06908467078": "s31fw-yk622",
    "wwurdm/07948702789": "qjs13-zv485",
    "wwurdm/98089702400": "30m5b-p0d31",
    "wwurdm/15089433997": "ba7tp-79369",
    "wwurdm/45948603783": "s47ed-yjj03",
    "wwurdm/46998429887": "panrf-tfk61",
    "wwurdm/62998535904": "2dspr-2b972",
    "wwurdm/95908702941": "gh5k8-tqh61",
    "wwurdm/82099685941": "q79mc-91t38",
    "wwurdm/52938726094": "rq1tk-96n87",
    "wwurdm/62998466784": "82rmr-c0k19",
    "wwurdm/40029646044": "jnn67-tne14",
    "wwurdm/17918510284": "nnmr5-bpe69",
    "wwurdm/15089438798": "1qahj-vp436",
    "wwurdm/06908431980": "ggtpq-1zm47",
    "wwurdm/11019551979": "mf7rm-k1d48",
    "wwurdm/00069513969": "8xdaa-1gy21",
    "wwurdm/19928400564": "jy1ga-ax851",
    "wwurdm/78968422803": "f7a49-7a220",
    "wwurdm/00179696213": "125mf-ce326",
    "wwurdm/95908666351": "c483z-eb091",
    "wwurdm/21019666100": "z6j1y-xep09",
    "wwurdm/82099695900": "b5pwt-msx24",
    "wwurdm/96988503606": "xbv3c-4p387",
    "wwurdm/66928402830": "r86d5-vdw90",
    "wwurdm/66998550814": "a7h28-njp81",
    "wwurdm/55938407038": "aqnqv-3nb84",
    "wwurdm/74089645706": "0g211-w5x55",
    "wwurdm/99988651453": "5cdae-vws61",
    "wwurdm/53968357754": "4j3v0-vjx36",
    "wwurdm/63908617525": "brrwt-qdc36",
    "wwurdm/19928431311": "81n97-2ap31",
    "wwurdm/50029384747": "vxhsf-ykz48",
    "wwurdm/17918477530": "gjrvt-wzv73",
    "wwurdm/23958477150": "8wmr7-rz007",
    "wwurdm/63968634097": "2bkhh-aqe05",
    "wwurdm/65908503683": "x5hhp-3rf67",
    "wwurdm/53968592959": "qaz4n-2g613",
    "wwurdm/46998613235": "1w76z-gf852",
    "wwurdm/63968759060": "63jb0-tez80",
    "wwurdm/19968501978": "sgm10-6c809",
    "wwurdm/33958509069": "8zrwn-fnr48",
    "wwurdm/40029693511": "zn1nn-aap68",
    "wwurdm/10039579809": "ea7pd-2nf55",
    "wwurdm/75948673060": "yat4h-7w479"
}


def create_blueprint(app):
    """Register blueprint routes on app."""
    blueprint = Blueprint(
        "datasafe_rdm",
        __name__,
        template_folder="./templates",
    )

    @blueprint.route("/me/home")
    @login_required
    def user_dashboard():
        """Page showing our custom user dashboard."""
        return render_template("datasafe_rdm/dashboard.html")

    @blueprint.route("/me/uploads")
    def user_uploads():
        """Redefine route to show our custom user dashboard."""
        return render_template("datasafe_rdm/dashboard.html")

    @blueprint.route("/archive/new")
    @login_required
    def archive_record():
        """Page for archiving records."""
        return render_template("datasafe_rdm/archiveRecord.html")

    @blueprint.route("/about")
    def about():
        """datasafe-rdm about page."""
        return render_template("datasafe_rdm/about.html")

    @blueprint.route("/privacy")
    def privacy():
        """datasafe-rdm about page."""
        return render_template("datasafe_rdm/privacy.html")

    @blueprint.route("/datasafe/download/wwurdm/<string:identifier>")
    @login_required
    def redirect_migrated_documents(identifier):
        """Redirect to migrated document from old datasafe."""
        if f"wwurdm/{identifier}" in identifier_mappings:
            identifier = f"wwurdm/{identifier}"
            return redirect(f"/records/{identifier_mappings[identifier]}")

        return render_template(current_app.config["THEME_404_TEMPLATE"]), 404

    # Add URL rules
    return blueprint


@login_required
def redirect_to_dashboard():
    """Redirect to user dashboard."""
    return redirect(url_for("datasafe_rdm.user_dashboard"))
