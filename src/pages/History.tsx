import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';
import NavMenu from '@/components/NavMenu';

interface HistoryItem {
  summary: string;
  url: string;
  timestamp: string;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('briefly_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleView = (item: HistoryItem) => {
    localStorage.setItem('current_summary', JSON.stringify(item));
    navigate('/results');
  };

  const handleDelete = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem('briefly_history', JSON.stringify(updated));
    toast({ title: 'Summary deleted' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 left-4">
        <NavMenu />
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">History</h1>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No summaries saved yet</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Summarize a video
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {item.url}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleDateString()} • {item.summary.length} characters
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleView(item)} size="sm">
                      View
                    </Button>
                    <Button 
                      onClick={() => handleDelete(index)} 
                      size="sm" 
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
