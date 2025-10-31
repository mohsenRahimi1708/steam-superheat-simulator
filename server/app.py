# server/app.py
from flask import Flask, jsonify, request
from pyXSteam.XSteam import XSteam
from flask_cors import CORS  # ← اضافه شد

app = Flask(__name__)
CORS(app)  # ← فعال‌سازی CORS برای همه درخواست‌ها
steam = XSteam(XSteam.UNIT_SYSTEM_MKS)  # m/kg/s/K/bar/kJ

@app.route('/superheat', methods=['GET'])
def superheat_properties():
    try:
        p_bar = float(request.args.get('p', 170.0))   # فشار به بار
        t_c = float(request.args.get('t', 540.0))     # دما به سانتی‌گراد

        # بررسی محدوده معتبر (اختیاری)
        if p_bar < 0.01 or p_bar > 1000 or t_c < 0 or t_c > 1000:
            return jsonify({"error": "ورودی خارج از محدوده معتبر"}), 400

        h = steam.h_pt(p_bar, t_c)  # آنتالپی (kJ/kg)
        s = steam.s_pt(p_bar, t_c)  # آنتروپی (kJ/kg·K)
        rho = steam.rho_pt(p_bar, t_c)  # چگالی (kg/m³)

        return jsonify({
            "pressure_bar": p_bar,
            "temperature_c": t_c,
            "enthalpy_kJkg": round(h, 2) if h is not None else None,
            "entropy_kJkgK": round(s, 4) if s is not None else None,
            "density_kgm3": round(rho, 2) if rho is not None else None
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health')
def health():
    return jsonify({"status": "ok", "message": "PYXSteam server is running"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
