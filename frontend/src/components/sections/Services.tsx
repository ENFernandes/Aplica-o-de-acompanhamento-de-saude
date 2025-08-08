import { Dumbbell, HeartPulse, Ruler } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  {
    icon: Dumbbell,
    title: "Treino Individual · Duo · Grupo",
    desc:
      "Sessões adaptadas ao teu objetivo e ritmo. Acompanhamento próximo para resultados consistentes.",
  },
  {
    icon: HeartPulse,
    title: "Pilates Clínico e Populações Especiais",
    desc:
      "Trabalho de controlo, respiração e mobilidade com foco terapêutico e progressões seguras.",
  },
  {
    icon: Ruler,
    title: "Correção Postural",
    desc:
      "Planos específicos para Hipercifose, Hiperlordose e Escoliose, melhorando alinhamento e conforto.",
  },
];

const Services = () => {
  return (
    <section id="servicos" className="scroll-mt-24 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium text-primary/90">Serviços</p>
          <h2 className="mt-2 text-2xl md:text-4xl font-bold tracking-tight">
            O teu corpo, o teu plano
          </h2>
          <p className="mt-3 text-muted-foreground">
            Treinos e sessões pensados para diferentes necessidades e níveis, sempre com técnica e progresso.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="group relative overflow-hidden border-muted/60 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-md bg-primary/10 ring-1 ring-primary/20 grid place-items-center text-primary">
                  <Icon className="size-6" />
                </div>
                <CardTitle className="mt-3 text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {desc}
              </CardContent>
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                background:
                  "radial-gradient(200px 200px at 80% 0%, hsl(var(--primary) / 0.06), transparent 60%)",
              }} />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
