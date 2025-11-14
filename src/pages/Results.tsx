import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Share2, Save, Repeat, Copy } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import NavMenu from '@/components/NavMenu';
// Upgrade modal handling moved to Summarize page

interface Summary {
  summary: string;
  url: string;
  timestamp: string;
}

const Results = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('current_summary');
    if (!saved) {
      navigate('/');
      return;
    }
    setSummary(JSON.parse(saved));
    checkUsage();
  }, [navigate]);

  const checkUsage = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usage', {
        credentials: 'include',
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      const data = await response.json();
      setCredits(data.credits || 0);
    } catch (error) {
      console.error('Failed to check usage');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary?.summary || '');
    toast({ title: 'Summary copied to clipboard!' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Briefly Summary',
        text: summary?.summary,
      });
    } else {
      handleCopy();
    }
  };

  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('briefly_history') || '[]');
    history.unshift(summary);
    localStorage.setItem('briefly_history', JSON.stringify(history.slice(0, 50)));
    toast({ title: 'Saved to History!' });
  };

  const handleSummarizeAnother = () => {
    localStorage.removeItem('current_summary');
    navigate('/');
  };

  if (!summary) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 left-4">
        <NavMenu />
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Summary</h1>
            <p className="text-sm text-muted-foreground">{summary.url}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {summary.summary}
            </p>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {summary.summary.length} characters
              </p>
              <p className="text-sm font-medium">
                Credits remaining: {credits}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={handleCopy} variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button onClick={handleSave} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save to History
            </Button>
            <Button onClick={handleSummarizeAnother}>
              <Repeat className="mr-2 h-4 w-4" />
              Summarize Another Video
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Results;
