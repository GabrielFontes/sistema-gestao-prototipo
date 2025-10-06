import { useState, useEffect } from 'react';
import { useEmpresa } from '@/contexts/EmpresaContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

interface EmpresaSettingsDialogProps {
  trigger?: React.ReactNode;
}

export function EmpresaSettingsDialog({ trigger }: EmpresaSettingsDialogProps) {
  const { currentEmpresa } = useEmpresa();
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState({
    dre: '',
    movimentacoes: '',
    fluxos: '',
    organograma: '',
    corpo: '',
    notas: '',
    projetos: '',
    operacao: '',
    sprint: '',
  });
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && currentEmpresa) {
      loadSettings();
    }
  }, [open, currentEmpresa]);

  const hslToHex = (hsl: string) => {
    const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
    if (!match) return '#3b82f6';
    
    const h = parseInt(match[1]);
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;
    
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const loadSettings = async () => {
    if (!currentEmpresa) return;

    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('primary_color, dre_link, movimentacoes_link, fluxos_link, organograma_link, corpo_link, notas_link, projetos_link, operacao_link, sprint_link')
        .eq('id', currentEmpresa.id)
        .single();

      if (error) throw error;

      if (data) {
        setPrimaryColor(hslToHex(data.primary_color || '0 0% 50%'));
        setLinks({
          dre: data.dre_link || '',
          movimentacoes: data.movimentacoes_link || '',
          fluxos: data.fluxos_link || '',
          organograma: data.organograma_link || '',
          corpo: data.corpo_link || '',
          notas: data.notas_link || '',
          projetos: data.projetos_link || '',
          operacao: data.operacao_link || '',
          sprint: data.sprint_link || '',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Não foi possível carregar as configurações.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit chamado', { currentEmpresa, links, primaryColor });

    if (!currentEmpresa) return;

    setIsLoading(true);
    try {
      const hslColor = hexToHsl(primaryColor);
      
      const { error } = await supabase
        .from('empresas')
        .update({
          primary_color: hslColor,
          dre_link: links.dre,
          movimentacoes_link: links.movimentacoes,
          fluxos_link: links.fluxos,
          organograma_link: links.organograma,
          corpo_link: links.corpo,
          notas_link: links.notas,
          projetos_link: links.projetos,
          operacao_link: links.operacao,
          sprint_link: links.sprint,
        })
        .eq('id', currentEmpresa.id);

      if (error) throw error;

      // Atualizar CSS
      document.documentElement.style.setProperty('--primary', hslColor);
      
      toast.success('Configurações salvas com sucesso!');
      setOpen(false);
      
      // Recarregar página para aplicar mudanças
      window.location.reload();
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Não foi possível salvar as configurações: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentEmpresa) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações da Empresa</DialogTitle>
          <DialogDescription>
            Configure a cor e os links de incorporação
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Cor Primária</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Links de Incorporação</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="dre" className="text-sm">DRE (Google Sheets)</Label>
                <Input
                  id="dre"
                  value={links.dre}
                  onChange={(e) => setLinks({ ...links, dre: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="movimentacoes" className="text-sm">Movimentações (Google Sheets)</Label>
                <Input
                  id="movimentacoes"
                  value={links.movimentacoes}
                  onChange={(e) => setLinks({ ...links, movimentacoes: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fluxos" className="text-sm">Fluxos (Lucidchart)</Label>
                <Input
                  id="fluxos"
                  value={links.fluxos}
                  onChange={(e) => setLinks({ ...links, fluxos: e.target.value })}
                  placeholder="https://lucid.app/..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="organograma" className="text-sm">Organograma (Lucidchart)</Label>
                <Input
                  id="organograma"
                  value={links.organograma}
                  onChange={(e) => setLinks({ ...links, organograma: e.target.value })}
                  placeholder="https://lucid.app/..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="corpo" className="text-sm">Corpo (Google Drive)</Label>
                <Input
                  id="corpo"
                  value={links.corpo}
                  onChange={(e) => setLinks({ ...links, corpo: e.target.value })}
                  placeholder="https://drive.google.com/..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="notas" className="text-sm">Notas (AppSheet)</Label>
                <Input
                  id="notas"
                  value={links.notas}
                  onChange={(e) => setLinks({ ...links, notas: e.target.value })}
                  placeholder="https://appsheet.com/..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="projetos" className="text-sm">Projetos (AppSheet)</Label>
                <Input
                  id="projetos"
                  value={links.projetos}
                  onChange={(e) => setLinks({ ...links, projetos: e.target.value })}
                  placeholder="https://appsheet.com/..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="operacao" className="text-sm">Operação (AppSheet)</Label>
                <Input
                  id="operacao"
                  value={links.operacao}
                  onChange={(e) => setLinks({ ...links, operacao: e.target.value })}
                  placeholder="https://appsheet.com/..."
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sprint" className="text-sm">Sprint (AppSheet)</Label>
                <Input
                  id="sprint"
                  value={links.sprint}
                  onChange={(e) => setLinks({ ...links, sprint: e.target.value })}
                  placeholder="https://appsheet.com/..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}