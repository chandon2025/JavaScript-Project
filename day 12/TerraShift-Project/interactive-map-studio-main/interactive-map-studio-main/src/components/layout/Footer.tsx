import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useLang } from "@/lib/lang";

export function Footer() {
  const { t, tr } = useLang();
  return (
    <footer className="mt-24 bg-forest text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TerraShift logo" className="h-12 w-12 rounded-xl object-contain bg-white/10 p-1" />
            <span className="font-display text-xl font-bold">TerraShift</span>
          </div>
          <p className="mt-4 max-w-sm text-sm opacity-85 leading-relaxed">
            {t("tagline")}{" "}
            {tr(
              "NASA satellite data turned into simple, field-level guidance for every farmer.",
              "নাসা উপগ্রহের তথ্য প্রতিটি কৃষকের জন্য মাঠপর্যায়ের সহজ নির্দেশনায় রূপান্তরিত।"
            )}
          </p>
        </div>
        <div className="grid gap-2.5 text-sm">
          <h4 className="mb-1 font-bold text-base">{tr("Platform", "প্ল্যাটফর্ম")}</h4>
          <Link to="/map" className="opacity-80 hover:opacity-100 transition-opacity">
            {tr("Interactive Map", "ইন্টারেক্টিভ মানচিত্র")}
          </Link>
          <Link to="/advisory" className="opacity-80 hover:opacity-100 transition-opacity">
            {tr("Crop Advisory", "ফসল পরামর্শ")}
          </Link>
          <Link to="/rotation" className="opacity-80 hover:opacity-100 transition-opacity">
            {tr("Crop Rotation", "ফসল আবর্তন")}
          </Link>
          <Link to="/weather" className="opacity-80 hover:opacity-100 transition-opacity">
            {tr("Weather & Climate", "আবহাওয়া ও জলবায়ু")}
          </Link>
          <Link to="/marketplace" className="opacity-80 hover:opacity-100 transition-opacity">
            {tr("Marketplace", "মার্কেটপ্লেস")}
          </Link>
        </div>
        <div className="grid gap-2.5 text-sm opacity-90">
          <h4 className="mb-1 font-bold text-base opacity-100">{tr("Contact", "যোগাযোগ")}</h4>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {tr("Dhaka, Bangladesh", "ঢাকা, বাংলাদেশ")}
          </span>
          <span className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> +৮৮০ ১৭০০-০০০০০০
          </span>
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> hello@terrashift.app
          </span>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs opacity-75">
        {t("copyright")}
      </div>
    </footer>
  );
}
