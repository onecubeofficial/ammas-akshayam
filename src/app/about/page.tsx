import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Award, Leaf, Users } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Amma's Akshayam — our story, mission, and commitment to preserving authentic Tamil Nadu food traditions.",
};

const milestones = [
  { year: "2018", event: "Founded in Chennai with 12 homemade products" },
  { year: "2019", event: "Expanded to 100+ products, reached 1000 customers" },
  { year: "2020", event: "Launched online store, FSSAI certified" },
  { year: "2022", event: "Serving all 38 Tamil Nadu districts" },
  { year: "2024", event: "10,000+ happy families milestone" },
  { year: "2026", event: "200+ products, pan-India shipping" },
];

const team = [
  {
    name: "Kamala Sundaram",
    role: "Founder & Head of Recipes",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&q=80",
    bio: "A passionate home cook with 30 years of experience in traditional Tamil Nadu cuisine.",
  },
  {
    name: "Karthik Sundaram",
    role: "Co-Founder & Operations",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    bio: "Ensuring every order reaches you fresh, on time, and with love.",
  },
  {
    name: "Priya Natarajan",
    role: "Quality & Sourcing",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80",
    bio: "Connects directly with Tamil Nadu farmers for the finest organic ingredients.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-maroon-900 to-maroon-800 py-20 overflow-hidden">
        <div className="absolute inset-0 kolam-bg opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <span className="text-gold-400 font-tamil text-lg block mb-2">
            எங்களை பற்றி
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            About Amma&apos;s Akshayam
          </h1>
          <p className="text-cream/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Born from a grandmother&apos;s kitchen, nurtured by a family&apos;s
            love, and delivered to yours — this is our story.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              title="Our Story"
              titleTamil="எங்கள் கதை"
              center={false}
            />
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                It all started with a simple box of homemade murukku. Kamala
                Sundaram, a passionate home cook from Chennai, had been making
                traditional Tamil Nadu snacks for her family for decades. When
                her neighbors started requesting her murukku and pickles, she
                realized there was something special worth sharing.
              </p>
              <p>
                In 2018, with just a modest kitchen and a heart full of
                tradition, Amma&apos;s Akshayam was born. The name itself
                reflects our philosophy — &quot;Akshayam&quot; means
                &quot;inexhaustible&quot; in Tamil, symbolizing the endless
                goodness of traditional food and the timeless nature of
                authentic recipes.
              </p>
              <p>
                Today, we work with a network of home cooks, local farmers, and
                artisan food producers across Tamil Nadu to bring you over 200
                products — each one crafted with care, using recipes passed down
                through generations.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-square shadow-premium">
              <Image
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80"
                alt="Traditional Tamil Nadu kitchen"
                width={600}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gold-500 text-white rounded-2xl p-4 shadow-gold">
              <div className="text-3xl font-display font-bold">6+</div>
              <div className="text-sm">Years of<br />Tradition</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Heart,
                title: "Our Mission",
                titleTamil: "எங்கள் நோக்கம்",
                text: "To preserve and celebrate the rich culinary heritage of Tamil Nadu by providing authentic, homemade food products that connect families to their roots, while supporting local farmers and home cooks across the state.",
                color: "text-rose-500",
                bg: "bg-rose-50 dark:bg-rose-900/20",
              },
              {
                icon: Leaf,
                title: "Our Vision",
                titleTamil: "எங்கள் பார்வை",
                text: "To be India's most trusted source for authentic regional food products, making traditional flavors accessible to every Indian family while keeping alive the cooking wisdom of our grandmothers for generations to come.",
                color: "text-leaf-600",
                bg: "bg-leaf-50 dark:bg-leaf-900/20",
              },
            ].map(({ icon: Icon, title, titleTamil, text, color, bg }) => (
              <div key={title} className="card p-8">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                  {title}
                </h3>
                <p className="text-sm text-gray-400 font-tamil mb-3">{titleTamil}</p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 bg-cream dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Journey" titleTamil="எங்கள் பயணம்" />
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-maroon-800 to-gold-500" />
            <div className="space-y-8 pl-12">
              {milestones.map(({ year, event }) => (
                <div key={year} className="relative">
                  <div className="absolute -left-8 w-4 h-4 rounded-full bg-maroon-800 border-4 border-cream dark:border-gray-950 top-1" />
                  <div className="text-xs font-bold text-gold-600 dark:text-gold-400 mb-1">
                    {year}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Meet Our Team"
            titleTamil="எங்கள் குழுவை சந்தியுங்கள்"
            subtitle="The passionate people behind every product"
          />
          <div className="grid sm:grid-cols-3 gap-8">
            {team.map(({ name, role, image, bio }) => (
              <div key={name} className="card p-6 text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-gold-200 dark:ring-gold-800">
                  <Image src={image} alt={name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{name}</h3>
                <p className="text-sm text-maroon-800 dark:text-gold-400 font-medium mb-2">
                  {role}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gradient-to-r from-maroon-800 to-maroon-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold mb-2">Quality Standards</h2>
          <p className="text-cream/80 mb-8 max-w-xl mx-auto">
            We adhere to the highest standards of food safety and quality
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["FSSAI Certified", "ISO 22000", "Organic Certified", "GMP Compliant"].map((cert) => (
              <div key={cert} className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-sm font-semibold">
                ✓ {cert}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
