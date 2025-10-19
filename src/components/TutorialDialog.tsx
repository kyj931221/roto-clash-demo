import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  RotateCw, 
  Users, 
  Compass,
  Play,
  CheckCircle
} from 'lucide-react';

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartTutorialGame: () => void;
}

const tutorialSteps = [
  {
    title: "Welcome to Roto-Clash!",
    icon: <Target className="w-8 h-8 text-blue-500" />,
    content: (
      <div className="space-y-4">
        <p>Roto-Clash is a turn-based puzzle board game where two players compete to reach the center of a 5x5 board first.</p>
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Game Objective:</h4>
          <p>Be the first player to move your piece to the golden center square (2,2)!</p>
        </div>
      </div>
    )
  },
  {
    title: "The Game Board",
    icon: <Target className="w-8 h-8 text-green-500" />,
    content: (
      <div className="space-y-4">
        <p>The game is played on a 5x5 grid with the following setup:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Player 1 (Blue)</strong> starts at bottom-left corner (0,4)</li>
          <li><strong>Player 2 (Red)</strong> starts at top-right corner (4,0)</li>
          <li><strong>Goal</strong> is the golden center square (2,2)</li>
        </ul>
        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm">💡 The board coordinates start from (0,0) at the top-left corner.</p>
        </div>
      </div>
    )
  },
  {
    title: "Player Roles",
    icon: <Users className="w-8 h-8 text-purple-500" />,
    content: (
      <div className="space-y-4">
        <p>Each turn, players take on different roles that alternate:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowRight className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold">Mover</h4>
            </div>
            <p className="text-sm">Chooses a direction card to move their piece on the board.</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <RotateCw className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold">Rotator</h4>
            </div>
            <p className="text-sm">Chooses a rotation card to change the compass direction.</p>
          </Card>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm">🔄 Roles switch every turn - if you're the Mover this turn, you'll be the Rotator next turn!</p>
        </div>
      </div>
    )
  },
  {
    title: "The Compass System",
    icon: <Compass className="w-8 h-8 text-red-500" />,
    content: (
      <div className="space-y-4">
        <p>The compass is the key mechanic that makes this game unique:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>The compass shows the current "North" direction</li>
          <li>All movement directions are relative to the compass</li>
          <li>The Rotator can change the compass direction by 90° clockwise or counterclockwise</li>
          <li>Each game starts with a random compass direction</li>
        </ul>
        <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm">⚠️ Remember: When the compass rotates, "North" changes, affecting all movement directions!</p>
        </div>
      </div>
    )
  },
  {
    title: "Turn Sequence",
    icon: <Play className="w-8 h-8 text-orange-500" />,
    content: (
      <div className="space-y-4">
        <p>Each turn follows this sequence:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li><strong>Card Selection:</strong> Both players secretly choose their cards</li>
          <li><strong>Rotation First:</strong> The Rotator's card is applied to the compass</li>
          <li><strong>Movement Second:</strong> The Mover's card is applied using the new compass direction</li>
          <li><strong>Role Switch:</strong> Players switch roles for the next turn</li>
        </ol>
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm">✅ This creates strategic depth - the Rotator can help or hinder the Mover's plans!</p>
        </div>
      </div>
    )
  },
  {
    title: "Strategy Tips",
    icon: <CheckCircle className="w-8 h-8 text-teal-500" />,
    content: (
      <div className="space-y-4">
        <p>Here are some strategic tips to improve your gameplay:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>As Mover:</strong> Plan your route to the center, but be ready to adapt</li>
          <li><strong>As Rotator:</strong> Think about how compass changes affect both players</li>
          <li><strong>Predict:</strong> Try to anticipate your opponent's moves</li>
          <li><strong>Block:</strong> Use rotations to make your opponent's moves less effective</li>
          <li><strong>Adapt:</strong> Be flexible - the compass changes everything!</li>
        </ul>
        <div className="bg-teal-50 dark:bg-teal-950 p-4 rounded-lg border border-teal-200 dark:border-teal-800">
          <p className="text-sm">🎯 The best players think several moves ahead and consider both roles!</p>
        </div>
      </div>
    )
  }
];

export const TutorialDialog: React.FC<TutorialDialogProps> = ({
  open,
  onOpenChange,
  onStartTutorialGame
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartTutorial = () => {
    onOpenChange(false);
    onStartTutorialGame();
  };

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Game Tutorial</span>
            <Badge variant="outline">
              {currentStep + 1} of {tutorialSteps.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Step {currentStep + 1} of {tutorialSteps.length}
            </p>
          </div>

          {/* Current Step Content */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              {tutorialSteps[currentStep].icon}
              <h3 className="text-xl font-semibold">
                {tutorialSteps[currentStep].title}
              </h3>
            </div>
            {tutorialSteps[currentStep].content}
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === tutorialSteps.length - 1 ? (
              <Button onClick={handleStartTutorial} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Start Tutorial Game
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};