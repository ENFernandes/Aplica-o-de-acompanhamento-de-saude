import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full">
      <nav className="container mx-auto flex items-center justify-between py-6">
        <a href="#home" className="flex items-center gap-3" aria-label="MiniBox Esposende">
          {/* Placeholder logo: trocaremos pelo logo oficial assim que disponibilizar */}
          <img 
            src="/assets/logo.png" 
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
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
