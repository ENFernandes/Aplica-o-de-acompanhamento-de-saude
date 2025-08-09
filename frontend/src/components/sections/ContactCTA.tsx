import { Button } from "@/components/ui/button";

const ContactCTA = () => {
  return (
    <section id="contacto" className="scroll-mt-24 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="rounded-xl border bg-card p-8 md:p-12 text-center shadow-sm">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            Pronto para começar?
          </h3>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Fala connosco para agendar uma avaliação e traçar o teu plano de treino.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {/* WhatsApp placeholder - substitui pelo teu número */}
            <a
              id="whatsapp-cta"
              href="https://wa.me/351000000000?text=Olá%20MiniBox%20Esposende!%20Quero%20marcar%20uma%20aula."
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="hero" size="lg">Falar no WhatsApp</Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
