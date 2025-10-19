import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Users, 
  Bot, 
  BookOpen, 
  Settings, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon,
  Trophy,
  RotateCcw
} from 'lucide-react';

interface GameMenuProps {
  onStartGame: (mode: 'ai' | 'local' | 'tutorial', difficulty?: 'easy' | 'medium' | 'hard') => void;
  onShowTutorial: () => void;
  onShowHistory: () => void;
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    theme: 'light' | 'dark';
    difficulty: 'easy' | 'medium' | 'hard';
  };
  onSettingsChange: (settings: any) => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  onStartGame,
  onShowTutorial,
  onShowHistory,
  settings,
  onSettingsChange
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>(settings.difficulty);

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
    onSettingsChange({ ...settings, difficulty });
  };

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'AI makes simple moves';
      case 'medium': return 'AI thinks ahead 2-3 moves';
      case 'hard': return 'AI uses advanced strategy';
      default: return '';
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Game Title */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Roto-Clash
        </h1>
        <p className="text-lg text-muted-foreground">서로의 길</p>
        <p className="text-sm text-muted-foreground">
          Turn-based puzzle board game with rotating compass
        </p>
      </div>

      {/* Game Mode Selection */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center">Choose Game Mode</h2>
        
        {/* AI Mode */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-500" />
              <span className="font-medium">vs AI</span>
            </div>
            <Badge variant="secondary">Single Player</Badge>
          </div>
          
          <Select value={selectedDifficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Easy</span>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Medium</span>
                </div>
              </SelectItem>
              <SelectItem value="hard">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Hard</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <p className="text-xs text-muted-foreground">
            {getDifficultyDescription(selectedDifficulty)}
          </p>
          
          <Button 
            onClick={() => onStartGame('ai', selectedDifficulty)}
            className="w-full"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            Start AI Game
          </Button>
        </div>

        <Separator />

        {/* Local Mode */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="font-medium">Local 2 Players</span>
            </div>
            <Badge variant="secondary">Hot Seat</Badge>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Take turns on the same device
          </p>
          
          <Button 
            onClick={() => onStartGame('local')}
            className="w-full"
            variant="outline"
            size="lg"
          >
            <Users className="w-4 h-4 mr-2" />
            Start Local Game
          </Button>
        </div>

        <Separator />

        {/* Tutorial Mode */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Tutorial</span>
            </div>
            <Badge variant="secondary">Learn</Badge>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Learn the game with guided instructions
          </p>
          
          <Button 
            onClick={() => onStartGame('tutorial')}
            className="w-full"
            variant="outline"
            size="lg"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Start Tutorial
          </Button>
        </div>
      </Card>

      {/* Additional Options */}
      <div className="flex space-x-3">
        <Button 
          onClick={onShowHistory}
          variant="outline"
          className="flex-1"
        >
          <Trophy className="w-4 h-4 mr-2" />
          History
        </Button>

        {/* Settings Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Game Settings</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Audio Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Audio</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <Label htmlFor="sound">Sound Effects</Label>
                  </div>
                  <Switch
                    id="sound"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => 
                      onSettingsChange({ ...settings, soundEnabled: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {settings.musicEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <Label htmlFor="music">Background Music</Label>
                  </div>
                  <Switch
                    id="music"
                    checked={settings.musicEnabled}
                    onCheckedChange={(checked) => 
                      onSettingsChange({ ...settings, musicEnabled: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              {/* Theme Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {settings.theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <Label htmlFor="theme">Dark Mode</Label>
                  </div>
                  <Switch
                    id="theme"
                    checked={settings.theme === 'dark'}
                    onCheckedChange={(checked) => 
                      onSettingsChange({ ...settings, theme: checked ? 'dark' : 'light' })
                    }
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};