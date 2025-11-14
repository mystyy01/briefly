import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Purchase Credits</DialogTitle>
          <DialogDescription>
            You've run out of credits. Purchase more to continue summarizing videos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-3">
            {/* Free Tier */}
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-sm">Free</h3>
              <p className="text-xl font-bold mb-3">£0</p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start">
                  <Check className="mr-1 h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <span>1.5 hours</span>
                </li>
                <li className="text-muted-foreground">3×30min videos</li>
              </ul>
            </div>

            {/* Lite Pack */}
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-sm">Lite Pack</h3>
              <p className="text-xl font-bold mb-1">£5.99</p>
              <p className="text-xs text-muted-foreground mb-3">£0.60/credit</p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start">
                  <Check className="mr-1 h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <span>10 credits</span>
                </li>
                <li className="text-muted-foreground">10 hours total</li>
              </ul>
              <Button className="w-full mt-3" size="sm">Buy Now</Button>
            </div>

            {/* Pro Pack - Best Value */}
            <div className="border-2 border-primary rounded-lg p-4 relative scale-105 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Best Value
              </div>
              <h3 className="font-semibold mb-2 text-sm">Pro Pack</h3>
              <p className="text-xl font-bold mb-1">£17.99</p>
              <p className="text-xs text-green-600 font-medium mb-3">£0.36/credit • 40% OFF</p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start">
                  <Check className="mr-1 h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <span>50 credits</span>
                </li>
                <li className="text-muted-foreground">50 hours total</li>
              </ul>
              <Button className="w-full mt-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" size="sm">
                Buy Now
              </Button>
            </div>

            {/* Ultra Pack */}
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-sm">Ultra Pack</h3>
              <p className="text-xl font-bold mb-1">£49.99</p>
              <p className="text-xs text-muted-foreground mb-3">£0.50/credit</p>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start">
                  <Check className="mr-1 h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <span>100 credits</span>
                </li>
                <li className="text-muted-foreground">100 hours total</li>
              </ul>
              <Button className="w-full mt-3" variant="outline" size="sm">Buy Now</Button>
            </div>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            Each credit equals 1 hour of YouTube video time. Video duration is rounded up to the nearest credit.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
