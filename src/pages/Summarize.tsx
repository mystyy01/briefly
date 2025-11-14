import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Loader2, Clipboard } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import NavMenu from '@/components/NavMenu';
import UpgradeModal from '@/components/UpgradeModal';

const Summarize = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      toast({ title: 'Pasted from clipboard' });
    } catch (error) {
      toast({ 
        title: 'Could not paste', 
        description: 'Please paste manually',
        variant: 'destructive' 
      });
    }
  };

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      toast({ 
        title: 'Invalid URL', 
        description: 'Please enter a valid YouTube URL',
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ url }),
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
        toast({ title: 'Session expired', description: 'Please log in again' });
        return;
      }

      if (response.status === 403) {
        // 403 indicates user should upgrade — open the upgrade modal
        setShowUpgradeModal(true);
        return;
      }

      const data = await response.json();

      if (response.ok && data.summary) {
        localStorage.setItem('current_summary', JSON.stringify({
          summary: data.summary,
          url,
          timestamp: new Date().toISOString(),
        }));
        navigate('/results');
      } else {
        toast({ 
          title: 'Summarization failed', 
          description: data.message || 'Could not summarize video',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to connect to server',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="absolute top-4 left-4">
        <NavMenu />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold text-foreground">Briefly</h1>
            <p className="text-lg text-muted-foreground">Watch less. Know more.</p>
          </div>

          <form onSubmit={handleSummarize} className="space-y-4">
            <div className="relative">
              <Input
                type="url"
                placeholder="Paste YouTube URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={loading}
                className="h-14 text-lg pr-12"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handlePaste}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Clipboard className="h-5 w-5" />
              </Button>
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 text-lg" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Summarizing your video...
                </>
              ) : (
                'Summarize'
              )}
            </Button>
          </form>
        </div>
      </div>
      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </div>
  );
};

export default Summarize;
