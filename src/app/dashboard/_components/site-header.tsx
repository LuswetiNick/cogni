'use client';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardCommand } from './dashboard-command';

export function SiteHeader() {
  const [commandOpen, setCommandOpen] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            className="mx-2 data-[orientation=vertical]:h-4"
            orientation="vertical"
          />
          <Button
            className="h-8 w-[240px] justify-start text-muted-foreground hover:text-muted-foreground"
            onClick={() => setCommandOpen((open) => !open)}
            size="sm"
            variant="outline"
          >
            <Search />
            Search
            <Kbd className="ml-auto text-[10px]">ctrl</Kbd>+
            <Kbd className="text-[10px]">K</Kbd>
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
