import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Palette, TrendingUp, Eye, Heart } from 'lucide-react';

export function StyleAnalysis() {
  const styleData = {
    dominantStyles: [
      { name: 'Minimalist', percentage: 45, color: 'bg-gray-500' },
      { name: 'Contemporary', percentage: 30, color: 'bg-purple-500' },
      { name: 'Street Style', percentage: 15, color: 'bg-pink-500' },
      { name: 'Classic', percentage: 10, color: 'bg-blue-500' }
    ],
    colorPalette: [
      { name: 'Neutral', hex: '#F5F5F5', percentage: 40 },
      { name: 'Black', hex: '#000000', percentage: 25 },
      { name: 'Navy', hex: '#1E3A8A', percentage: 15 },
      { name: 'Camel', hex: '#C19A6B', percentage: 10 },
      { name: 'Forest Green', hex: '#228B22', percentage: 10 }
    ],
    patterns: [
      { name: 'Solid Colors', percentage: 70 },
      { name: 'Subtle Textures', percentage: 20 },
      { name: 'Minimal Prints', percentage: 10 }
    ],
    occasions: [
      { name: 'Professional', percentage: 40, items: 12 },
      { name: 'Casual', percentage: 35, items: 10 },
      { name: 'Evening', percentage: 15, items: 4 },
      { name: 'Weekend', percentage: 10, items: 3 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl">Style Analysis</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Deep insights into your fashion preferences based on your wardrobe and social media activity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Style Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Style Distribution
            </CardTitle>
            <CardDescription>Your fashion style breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {styleData.dominantStyles.map((style, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{style.name}</span>
                  <span className="text-sm text-gray-600">{style.percentage}%</span>
                </div>
                <Progress value={style.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-pink-600" />
              Color Palette
            </CardTitle>
            <CardDescription>Your preferred color scheme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {styleData.colorPalette.map((color, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-gray-200"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs text-gray-600">{color.name}</p>
                  <p className="text-xs">{color.percentage}%</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {styleData.colorPalette.map((color, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm">{color.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{color.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pattern Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Pattern Preferences
            </CardTitle>
            <CardDescription>Types of patterns you gravitate towards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {styleData.patterns.map((pattern, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{pattern.name}</span>
                  <span className="text-sm text-gray-600">{pattern.percentage}%</span>
                </div>
                <Progress value={pattern.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Occasion Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              Occasion Breakdown
            </CardTitle>
            <CardDescription>How you dress for different occasions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {styleData.occasions.map((occasion, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm">{occasion.name}</p>
                  <p className="text-xs text-gray-600">{occasion.items} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{occasion.percentage}%</p>
                  <div className="w-16 mt-1">
                    <Progress value={occasion.percentage} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Style Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Style Insights</CardTitle>
          <CardDescription className="text-purple-700">
            Personalized observations about your fashion choices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/60 rounded-lg">
              <h4 className="text-sm text-purple-800 mb-2">Signature Style</h4>
              <p className="text-sm text-gray-700">
                You have a strong minimalist aesthetic with contemporary touches. Your wardrobe shows a preference for clean lines and neutral colors.
              </p>
            </div>
            <div className="p-4 bg-white/60 rounded-lg">
              <h4 className="text-sm text-purple-800 mb-2">Growth Opportunity</h4>
              <p className="text-sm text-gray-700">
                Consider adding more statement pieces or bold colors to create visual interest while maintaining your sophisticated aesthetic.
              </p>
            </div>
            <div className="p-4 bg-white/60 rounded-lg">
              <h4 className="text-sm text-purple-800 mb-2">Wardrobe Balance</h4>
              <p className="text-sm text-gray-700">
                Your professional and casual wear are well-balanced. Consider expanding your evening wear collection for special occasions.
              </p>
            </div>
            <div className="p-4 bg-white/60 rounded-lg">
              <h4 className="text-sm text-purple-800 mb-2">Trending Elements</h4>
              <p className="text-sm text-gray-700">
                Your recent Pinterest saves show interest in sustainable fashion and timeless pieces, aligning with current conscious fashion trends.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}