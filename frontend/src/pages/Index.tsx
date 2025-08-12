import { useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import ContactCTA from "@/components/sections/ContactCTA";

const Index = () => {
  // Dynamic canonical tag for SEO
  useEffect(() => {
    const href = window.location.origin + "/";
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);

    // Atualiza o link do WhatsApp com o número vindo da API
    (async () => {
      try {
        const resp = await fetch('/api/public/settings', { credentials: 'omit' });
        if (!resp.ok) return;
        const data = await resp.json();
        const phone = data?.settings?.whatsappNumber;
        if (phone && /^\d{9,15}$/.test(String(phone))) {
          const anchor = document.getElementById('whatsapp-cta') as HTMLAnchorElement | null;
          if (anchor) {
            const msg = encodeURIComponent('Olá MiniBox Esposende! Quero marcar uma aula.');
            anchor.href = `https://wa.me/${phone}?text=${msg}`;
          }
        }
      } catch (_) {}
    })();
  }, []);

  // Structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: "MiniBox Esposende",
    areaServed: "Esposende, Braga, Portugal",
    description:
      "Estúdio boutique de treino personalizado em Esposende: Treino Individual, Duo e Grupo, Pilates Clínico e Populações Especiais e Correção Postural.",
    serviceType: [
      "Treino Individual",
      "Treino Duo",
      "Treino em Grupo",
      "Pilates Clínico",
      "Pilates para Populações Especiais",
      "Correção Postural (Hipercifose, Hiperlordose, Escoliose)",
    ],
    url: typeof window !== "undefined" ? window.location.href : "",
  };

  return (
    <>
      <header className="w-full sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav className="container mx-auto flex items-center justify-between py-4">
          <a href="#home" className="flex items-center gap-3" aria-label="MiniBox Esposende">
            {/* Placeholder logo: trocaremos pelo logo oficial assim que disponibilizar */}
            <img 
              src="/assets/logoMinibox.jpg" 
              alt="Logo MiniBox Esposende" 
              className="h-10 w-10 rounded-md ring-1 ring-primary/30 object-cover bg-transparent" 
              loading="lazy" 
              decoding="async" 
            />
            
          </a>
          <div className="flex items-center gap-3">
            <a href="#servicos" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Serviços
            </a>
            <a href="#contacto" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Contacto
            </a>
            <a href="/login.html" className="ml-2 inline-flex h-10 items-center rounded-md bg-primary px-4 text-primary-foreground hover:bg-primary/90 transition-colors">
              Login
            </a>
          </div>
        </nav>
      </header>

      <main>
        <Hero />
        <Services />
        <ContactCTA />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <footer className="border-t mt-16">
        <div className="container mx-auto py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MiniBox Esposende. Todos os direitos reservados.</p>
          <a href="#home" className="hover:text-foreground transition-colors">Voltar ao topo</a>
        </div>
      </footer>
    </>
  );
};

export default Index;
