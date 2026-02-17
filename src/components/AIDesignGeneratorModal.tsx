import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Sparkles,
  Lightbulb,
  Briefcase,
  ShoppingCart,
  Camera,
  Users,
  Heart,
  Calendar,
  X,
} from "lucide-react";
import { ComponentData } from "../App";

interface AIDesignGeneratorModalProps {
  onClose: () => void;
  onGenerate: (components: ComponentData[]) => void;
}

export function AIDesignGeneratorModal({
  onClose,
  onGenerate,
}: AIDesignGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const examplePrompts = [
    {
      icon: Briefcase,
      category: "Business",
      prompt: "Create a modern SaaS landing page with a hero section, feature highlights, pricing table, and testimonials for a project management tool",
    },
    {
      icon: ShoppingCart,
      category: "E-commerce",
      prompt: "Design an elegant online boutique homepage with product showcase, featured collections, and newsletter signup",
    },
    {
      icon: Camera,
      category: "Portfolio",
      prompt: "Build a minimalist photography portfolio with a full-screen image gallery, about section, and contact form",
    }
  ];

  const generateDesignFromPrompt = async (userPrompt: string) => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Step 1: Analyzing requirements
      setCurrentStep('Analyzing your requirements...');
      setGenerationProgress(25);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 2: Generating structure
      setCurrentStep('Generating component structure...');
      setGenerationProgress(50);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 3: Optimizing design
      setCurrentStep('Optimizing design elements...');
      setGenerationProgress(75);
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Step 4: Finalizing
      setCurrentStep('Finalizing your design...');
      setGenerationProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Generate components based on prompt
      const components = analyzePromptAndGenerateComponents(userPrompt);
      onGenerate(components);
    } catch (error) {
      console.error('AI Generation Error:', error);
    } finally {
      setIsGenerating(false);
      setCurrentStep('');
      setGenerationProgress(0);
    }
  };

  const analyzePromptAndGenerateComponents = (userPrompt: string): ComponentData[] => {
    const prompt = userPrompt.toLowerCase();
    const components: ComponentData[] = [];
    let componentId = 1;

    // Always start with navigation
    components.push({
      id: (componentId++).toString(),
      type: "navbar",
      props: {
        brand: extractBrandName(prompt),
        links: generateNavigationLinks(prompt),
      },
      style: {},
    });

    // Add hero section for most sites
    if (!prompt.includes("blog") || prompt.includes("landing")) {
      components.push({
        id: (componentId++).toString(),
        type: "hero",
        props: {
          title: generateHeroTitle(prompt),
          subtitle: generateHeroSubtitle(prompt),
        },
        style: {
          padding: "4rem 2rem",
          textAlign: "center" as const,
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "center" as const,
        },
      });
    }

    // Add specific components based on keywords
    if (prompt.includes("feature") || prompt.includes("service")) {
      components.push({
        id: (componentId++).toString(),
        type: "heading",
        props: { content: "Our Features", level: 2 },
        style: { textAlign: "center", margin: "3rem 0 1rem" },
      });

      components.push({
        id: (componentId++).toString(),
        type: "grid",
        props: { columns: 3 },
        style: { margin: "2rem 0" },
      });
    }

    if (prompt.includes("portfolio") || prompt.includes("gallery")) {
      components.push({
        id: (componentId++).toString(),
        type: "gallery",
        props: { images: [] },
        style: { margin: "3rem 0" },
      });
    }

    if (prompt.includes("contact") || prompt.includes("form")) {
      components.push({
        id: (componentId++).toString(),
        type: "form",
        props: { title: "Get in touch" },
        style: { maxWidth: "600px", margin: "3rem auto" },
      });
    }

    // Always end with footer
    components.push({
      id: (componentId++).toString(),
      type: "footer",
      props: {
        copyright: `© 2024 ${extractBrandName(prompt)}. All rights reserved.`,
      },
      style: {},
    });

    return components;
  };

  const extractBrandName = (prompt: string): string => {
    if (prompt.includes("saas") || prompt.includes("project management")) return "TaskFlow";
    if (prompt.includes("boutique") || prompt.includes("ecommerce")) return "Boutique";
    if (prompt.includes("photography")) return "Studio";
    if (prompt.includes("blog")) return "Blog";
    return "YourBrand";
  };

  const generateNavigationLinks = (prompt: string): string[] => {
    if (prompt.includes("saas")) return ["Features", "Pricing", "About", "Contact"];
    if (prompt.includes("ecommerce") || prompt.includes("boutique")) 
      return ["Shop", "Collections", "About", "Contact"];
    if (prompt.includes("portfolio")) return ["Work", "About", "Contact"];
    if (prompt.includes("blog")) return ["Home", "Articles", "About", "Contact"];
    return ["Home", "About", "Services", "Contact"];
  };

  const generateHeroTitle = (prompt: string): string => {
    if (prompt.includes("saas") || prompt.includes("project management")) 
      return "Streamline Your Projects";
    if (prompt.includes("boutique")) return "Discover Unique Style";
    if (prompt.includes("photography")) return "Capturing Life's Moments";
    if (prompt.includes("fitness")) return "Transform Your Fitness Journey";
    return "Welcome to Excellence";
  };

  const generateHeroSubtitle = (prompt: string): string => {
    if (prompt.includes("saas")) 
      return "The ultimate project management solution for modern teams";
    if (prompt.includes("boutique")) 
      return "Curated fashion pieces for the modern individual";
    if (prompt.includes("photography")) 
      return "Professional photography that tells your story";
    if (prompt.includes("fitness")) 
      return "Join thousands who have achieved their fitness goals";
    return "Experience quality and innovation like never before";
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Design Generator
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="max-w-full mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold">AI Design Generator</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Describe your vision and let our AI create a professional website design 
                tailored to your needs. Be as detailed as possible for the best results.
              </p>
            </div>

            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Describe Your Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Example: Create a modern landing page for a fitness app with a hero section showcasing workout videos, testimonials from users, pricing plans, and a download section..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isGenerating}
                />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {prompt.length}/500 characters
                  </div>
                  <Button
                    onClick={() => generateDesignFromPrompt(prompt)}
                    disabled={!prompt.trim() || isGenerating || prompt.length > 500}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Design
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Section */}
            {isGenerating && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Generating your design...</span>
                      <span className="text-sm text-muted-foreground">
                        {generationProgress}%
                      </span>
                    </div>
                    <Progress value={generationProgress} className="w-full" />
                    {currentStep && (
                      <p className="text-sm text-muted-foreground">{currentStep}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Example Prompts */}
            <Card>
              <CardHeader>
                <CardTitle>Example Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {examplePrompts.map((example, index) => {
                    const IconComponent = example.icon;
                    return (
                      <div
                        key={index}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setPrompt(example.prompt)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">{example.category}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-3">
                              {example.prompt}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
