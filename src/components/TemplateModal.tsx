import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { 
  X, 
  Search, 
  Zap,
  Layout,
  Users,
  Briefcase,
  ShoppingCart,
  Heart,
  Camera,
  Calendar,
  Mail,
  Play
} from 'lucide-react';
import { ComponentData } from '../App';


interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  components: ComponentData[];
  preview: string;
  thumbnail: string;
  isPro?: boolean;
}

interface TemplateModalProps {
  onSelectTemplate: (components: ComponentData[]) => void;
  onClose: () => void;
}

export function TemplateModal({ onSelectTemplate, onClose }: TemplateModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');


  const templates: Template[] = [
    // Business Template - Modern Corporate
    {
      id: 'business-corporate',
      name: 'Corporate Business',
      description: 'Professional business website with modern design',
      category: 'Business',
      tags: ['corporate', 'business', 'professional', 'enterprise'],
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      preview: 'Hero • Services • About • Team • Testimonials',
      components: [
        {
          id: '1',
          type: 'navbar',
          props: { 
            brand: 'BusinessPro', 
            links: ['Home', 'Services', 'About', 'Team', 'Contact'],
            cta: { text: 'Get Started', url: '#contact' }
          },
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '1rem 5%'
          }
        },
        {
          id: '2',
          type: 'hero',
          props: { 
            title: 'Innovative Business Solutions', 
            subtitle: 'Transforming ideas into successful business realities',
            primaryButton: { text: 'Our Services', url: '#services' },
            secondaryButton: { text: 'Learn More', url: '#about' },
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
          },
          style: { 
            minHeight: '80vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            textAlign: 'center',
            padding: '8rem 2rem 6rem'
          }
        },
        {
          id: '3',
          type: 'features',
          props: {
            title: 'Our Services',
            subtitle: 'Comprehensive solutions for your business needs',
            items: [
              {
                icon: 'Briefcase',
                title: 'Business Strategy',
                description: 'Strategic planning and business development services to help you grow.'
              },
              {
                icon: 'BarChart',
                title: 'Market Analysis',
                description: 'In-depth market research and competitive analysis.'
              },
              {
                icon: 'Users',
                title: 'Team Building',
                description: 'Build and optimize high-performing teams.'
              }
            ]
          },
          style: { padding: '5rem 2rem', backgroundColor: '#f8fafc' }
        }
      ]
    },

    // Portfolio Template - Creative Showcase
    {
      id: 'portfolio-creative',
      name: 'Creative Portfolio',
      description: 'Elegant portfolio to showcase your creative work',
      category: 'Portfolio',
      tags: ['portfolio', 'creative', 'designer', 'artist'],
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      preview: 'Hero • Work • About • Contact',
      components: [
        {
          id: '1',
          type: 'navbar',
          props: { 
            brand: 'CreativePortfolio', 
            links: ['Work', 'About', 'Contact'],
            transparent: true
          },
          style: {
            position: 'absolute',
            width: '100%',
            zIndex: 1000,
            padding: '1.5rem 5%',
            backgroundColor: 'transparent',
            color: '#ffffff'
          }
        },
        {
          id: '2',
          type: 'hero',
          props: { 
            title: 'Creative Designer & Developer', 
            subtitle: 'Bringing ideas to life through design and code',
            backgroundImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
            overlay: 'rgba(0,0,0,0.6)'
          },
          style: { 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: '#ffffff',
            position: 'relative'
          }
        },
        {
          id: '3',
          type: 'gallery',
          props: {
            title: 'Selected Works',
            subtitle: 'A collection of my recent projects',
            items: [
              {
                title: 'Web Design',
                category: 'UI/UX',
                image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
              },
              {
                title: 'Mobile App',
                category: 'Development',
                image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
              },
              {
                title: 'Brand Identity',
                category: 'Design',
                image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
              }
            ]
          },
          style: { padding: '6rem 2rem', backgroundColor: '#ffffff' }
        }
      ]
    },

    // E-commerce Template - Modern Shop
    {
      id: 'ecommerce-shop',
      name: 'Modern E-commerce',
      description: 'Sleek online store with product showcase',
      category: 'E-commerce',
      tags: ['ecommerce', 'shop', 'products', 'store'],
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      preview: 'Header • Featured • Categories • Products • Cart',
      isPro: true,
      components: [
        {
          id: '1',
          type: 'navbar',
          props: { 
            brand: 'ShopNow', 
            links: ['Home', 'Shop', 'Categories', 'Sale'],
            icons: [
              { name: 'Search', url: '#' },
              { name: 'User', url: '#' },
              { name: 'ShoppingCart', url: '#' }
            ]
          },
          style: {
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '1rem 5%',
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }
        },
        {
          id: '2',
          type: 'hero',
          props: {
            title: 'Summer Collection 2024',
            subtitle: 'Up to 50% off on selected items',
            primaryButton: { text: 'Shop Now', url: '#shop' },
            secondaryButton: { text: 'View Sale', url: '#sale' },
            backgroundImage: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            overlay: 'rgba(0,0,0,0.4)'
          },
          style: {
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '0 10%',
            color: '#ffffff',
            position: 'relative',
            marginBottom: '4rem'
          }
        },
        {
          id: '3',
          type: 'product-grid',
          props: {
            title: 'Featured Products',
            subtitle: 'Handpicked items just for you',
            products: [
              {
                name: 'Wireless Headphones',
                price: 199.99,
                originalPrice: 249.99,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                rating: 4.5,
                reviewCount: 128
              },
              {
                name: 'Smart Watch',
                price: 299.99,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80',
                rating: 4.8,
                reviewCount: 256
              }
            ]
          },
          style: { padding: '0 2rem 6rem' }
        }
      ]
    },

    // Blog Template - Modern Magazine
    {
      id: 'blog-magazine',
      name: 'Modern Magazine',
      description: 'Elegant blog and content platform',
      category: 'Blog',
      tags: ['blog', 'magazine', 'articles', 'content'],
      thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      preview: 'Header • Featured • Articles • Newsletter',
      components: [
        {
          id: '1',
          type: 'navbar',
          props: { 
            brand: 'The Blog', 
            links: ['Home', 'Categories', 'About', 'Contact'],
            search: true
          },
          style: {
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            padding: '1.5rem 5%',
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }
        },
        {
          id: '2',
          type: 'featured-post',
          props: {
            title: 'The Future of Web Design',
            excerpt: 'Exploring the latest trends and technologies shaping the future of digital experiences.',
            author: 'Jane Smith',
            date: 'May 15, 2024',
            readTime: '8 min read',
            category: 'Design',
            image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80'
          },
          style: {
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '4rem 10%',
            color: '#ffffff',
            position: 'relative',
            marginBottom: '4rem',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))'
          }
        },
        {
          id: '3',
          type: 'post-grid',
          props: {
            title: 'Latest Articles',
            subtitle: 'Fresh content updated daily',
            posts: [
              {
                title: '10 Tips for Better UI Design',
                excerpt: 'Learn how to create intuitive and beautiful user interfaces.',
                image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'Design',
                date: 'May 10, 2024',
                readTime: '5 min read'
              },
              {
                title: 'The Rise of AI in Development',
                excerpt: 'How artificial intelligence is changing the way we build software.',
                image: 'https://images.unsplash.com/photo-1677442135136-760c8134b36e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                category: 'Technology',
                date: 'May 8, 2024',
                readTime: '7 min read'
              }
            ]
          },
          style: { 
            padding: '0 2rem 6rem',
            backgroundColor: '#f8fafc'
          }
        }
      ]
    },

    // Restaurant Template - Food & Dining
    {
      id: 'restaurant-gourmet',
      name: 'Gourmet Restaurant',
      description: 'Elegant restaurant website with menu and reservations',
      category: 'Restaurant',
      tags: ['restaurant', 'food', 'menu', 'reservation'],
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      preview: 'Hero • Menu • Gallery • Reservations',
      components: [
        {
          id: '1',
          type: 'navbar',
          props: { 
            brand: 'Savory', 
            links: ['Home', 'Menu', 'About', 'Gallery', 'Contact'],
            cta: { text: 'Reserve a Table', url: '#reservations' }
          },
          style: {
            position: 'absolute',
            width: '100%',
            zIndex: 1000,
            padding: '1.5rem 5%',
            backgroundColor: 'transparent',
            color: '#ffffff'
          }
        },
        {
          id: '2',
          type: 'hero',
          props: {
            title: 'Fine Dining Experience',
            subtitle: 'Exquisite cuisine in an elegant atmosphere',
            primaryButton: { text: 'View Menu', url: '#menu' },
            secondaryButton: { text: 'Reserve a Table', url: '#reservations' },
            backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            overlay: 'rgba(0,0,0,0.5)'
          },
          style: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: '#ffffff',
            position: 'relative'
          }
        },
        {
          id: '3',
          type: 'menu-section',
          props: {
            title: 'Our Menu',
            subtitle: 'Crafted with the finest ingredients',
            categories: [
              {
                name: 'Starters',
                items: [
                  { name: 'Bruschetta', description: 'Toasted bread with tomatoes, garlic, and basil', price: 12.99 },
                  { name: 'Calamari', description: 'Crispy fried squid with marinara sauce', price: 15.99 }
                ]
              },
              {
                name: 'Main Courses',
                items: [
                  { name: 'Filet Mignon', description: '8oz grass-fed beef with seasonal vegetables', price: 34.99 },
                  { name: 'Grilled Salmon', description: 'Fresh Atlantic salmon with lemon butter sauce', price: 28.99 }
                ]
              }
            ]
          },
          style: { 
            padding: '6rem 2rem',
            backgroundColor: '#ffffff'
          }
        }
      ]
    },

    // Event Template - Conference
    {
      id: 'event-conference',
      name: 'Tech Conference',
      description: 'Professional event and conference website',
      category: 'Events',
      tags: ['conference', 'event', 'tech', 'speakers'],
      thumbnail: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      preview: 'Hero • Speakers • Schedule • Register',
      components: [
        {
          id: '1',
          type: 'navbar',
          props: { 
            brand: 'TechConf 2024', 
            links: ['About', 'Speakers', 'Schedule', 'Venue', 'Sponsors'],
            cta: { text: 'Get Tickets', url: '#tickets' }
          },
          style: {
            position: 'fixed',
            width: '100%',
            zIndex: 1000,
            padding: '1.5rem 5%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            color: '#ffffff'
          }
        },
        {
          id: '2',
          type: 'hero',
          props: {
            title: 'TechConf 2024',
            subtitle: 'The Future of Technology',
            date: 'October 15-17, 2024 | San Francisco, CA',
            primaryButton: { text: 'Get Tickets', url: '#tickets' },
            secondaryButton: { text: 'View Schedule', url: '#schedule' },
            backgroundImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            overlay: 'rgba(0,0,0,0.6)'
          },
          style: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: '#ffffff',
            position: 'relative',
            padding: '0 1rem'
          }
        },
        {
          id: '3',
          type: 'speakers',
          props: {
            title: 'Featured Speakers',
            subtitle: 'Industry leaders and innovators',
            speakers: [
              {
                name: 'Alex Johnson',
                title: 'CEO, Tech Innovations',
                bio: 'Expert in AI and machine learning',
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                social: {
                  twitter: '#',
                  linkedin: '#',
                  website: '#'
                }
              },
              {
                name: 'Sarah Williams',
                title: 'CTO, Future Tech',
                bio: 'Blockchain and cryptocurrency specialist',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                social: {
                  twitter: '#',
                  linkedin: '#',
                  website: '#'
                }
              }
            ]
          },
          style: { 
            padding: '6rem 2rem',
            backgroundColor: '#ffffff'
          }
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: Layout },
    { id: 'Business', name: 'Business', icon: Briefcase },
    { id: 'Portfolio', name: 'Portfolio', icon: Camera },
    { id: 'E-commerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'Blog', name: 'Blog', icon: Users },
    { id: 'Restaurant', name: 'Restaurant', icon: Heart },
    { id: 'Events', name: 'Events', icon: Calendar }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] w-full p-0" aria-describedby="template-modal-description">
        <DialogHeader className="sr-only">
          <DialogTitle>Templates</DialogTitle>
          <DialogDescription id="template-modal-description">
            Choose from our collection of professional templates
          </DialogDescription>
        </DialogHeader>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Templates</h2>
              <p className="text-sm text-muted-foreground">Choose from our collection of professional templates</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
              {/* Search and Filters */}
              <div className="px-6 py-4 border-b bg-gray-50/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex items-center gap-2 whitespace-nowrap"
                        >
                          <Icon className="w-4 h-4" />
                          {category.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Templates Grid */}
              <div className="flex-1 overflow-y-auto p-6 template-grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="template-card group cursor-pointer border-0 ring-1 ring-gray-200 hover:ring-blue-300">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="template-image w-full h-full object-cover"
                        />
                        {template.isPro && (
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium">
                            <Zap className="w-3 h-3 mr-1" />
                            PRO
                          </Badge>
                        )}
                        <div className="template-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-3 left-3 right-3">
                            <Button
                              size="sm"
                              className="w-full bg-white text-black hover:bg-white/90"
                              onClick={() => onSelectTemplate(template.components)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Use Template
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium line-clamp-1">{template.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {template.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium mb-2">No templates found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
