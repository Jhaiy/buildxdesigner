import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Database, 
  Server, 
  Code2, 
  Copy, 
  Check,
  Settings,
  Globe,
  Lightbulb,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { ComponentData } from '../App';

interface BackendGeneratorModalProps {
  components: ComponentData[];
  isOpen: boolean;
  onClose: () => void;
}

interface BackendConfig {
  technology: string;
  databaseType: string;
  frontendFramework: string;
}

const BACKEND_TECHNOLOGIES = [
  {
    id: 'nodejs',
    name: 'Node.js + Express',
    description: 'Fast and scalable JavaScript backend',
    icon: '🟢',
    popular: true
  },
  {
    id: 'python',
    name: 'Python + FastAPI',
    description: 'Modern Python web framework',
    icon: '🐍',
    popular: true
  },
  {
    id: 'php',
    name: 'PHP + Laravel',
    description: 'Elegant PHP web framework',
    icon: '🐘',
    popular: false
  },
  {
    id: 'java',
    name: 'Java + Spring Boot',
    description: 'Enterprise-grade Java framework',
    icon: '☕',
    popular: false
  },
  {
    id: 'csharp',
    name: 'C# + ASP.NET Core',
    description: 'Microsoft\'s web framework',
    icon: '💜',
    popular: false
  }
];

const FRONTEND_FRAMEWORKS = [
  { id: 'react', name: 'React', description: 'Popular JavaScript library' },
  { id: 'vue', name: 'Vue.js', description: 'Progressive JavaScript framework' },
  { id: 'angular', name: 'Angular', description: 'Full-featured framework' },
  { id: 'vanilla', name: 'Vanilla JavaScript', description: 'Plain JavaScript' }
];

const DATABASE_TYPES = [
  { id: 'mysql', name: 'MySQL', description: 'Popular relational database' },
  { id: 'postgresql', name: 'PostgreSQL', description: 'Advanced open-source database' },
  { id: 'mongodb', name: 'MongoDB', description: 'NoSQL document database' },
  { id: 'sqlite', name: 'SQLite', description: 'Lightweight file-based database' }
];

export function BackendGeneratorModal({ components, isOpen, onClose }: BackendGeneratorModalProps) {
  const [config, setConfig] = useState<BackendConfig>({
    technology: 'nodejs',
    databaseType: 'postgresql',
    frontendFramework: 'react'
  });

  const [activeTab, setActiveTab] = useState('config');
  const [generatedSuggestion, setGeneratedSuggestion] = useState<string>('');
  const [copiedSuggestion, setCopiedSuggestion] = useState(false);

  const updateConfig = (updates: Partial<BackendConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const generateSuggestion = () => {
    const suggestion = generateConnectionSuggestion(config);
    setGeneratedSuggestion(suggestion);
    setActiveTab('suggestion');
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSuggestion(true);
      setTimeout(() => {
        setCopiedSuggestion(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy suggestion:', err);
    }
  };

  const selectedTech = BACKEND_TECHNOLOGIES.find(t => t.id === config.technology);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6" />
            Backend Connection Guide
          </DialogTitle>
        </DialogHeader>

        <Alert className="mb-4">
          <Lightbulb className="w-4 h-4" />
          <AlertDescription>
            This tool provides code suggestions and examples for connecting your frontend to a database. 
            Choose your preferred technology stack to get customized connection examples and setup guides.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="suggestion" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Connection Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Technology Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Backend Technology</CardTitle>
                  <CardDescription>Choose your preferred backend technology for connection examples</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BACKEND_TECHNOLOGIES.map(tech => (
                      <div
                        key={tech.id}
                        className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                          config.technology === tech.id
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => updateConfig({ technology: tech.id })}
                      >
                        {tech.popular && (
                          <Badge variant="secondary" className="absolute top-2 right-2">
                            Popular
                          </Badge>
                        )}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{tech.icon}</span>
                          <h3 className="font-medium">{tech.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{tech.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Database Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Database Selection</CardTitle>
                  <CardDescription>Choose your database to get specific connection examples</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="databaseType">Database Type</Label>
                    <Select
                      value={config.databaseType}
                      onValueChange={(value) => updateConfig({ databaseType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select database" />
                      </SelectTrigger>
                      <SelectContent>
                        {DATABASE_TYPES.map(db => (
                          <SelectItem key={db.id} value={db.id}>
                            <div>
                              <div className="font-medium">{db.name}</div>
                              <div className="text-sm text-muted-foreground">{db.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Frontend Framework */}
              <Card>
                <CardHeader>
                  <CardTitle>Frontend Framework</CardTitle>
                  <CardDescription>Your frontend technology for API integration examples</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="frontendFramework">Framework</Label>
                    <Select
                      value={config.frontendFramework}
                      onValueChange={(value) => updateConfig({ frontendFramework: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frontend framework" />
                      </SelectTrigger>
                      <SelectContent>
                        {FRONTEND_FRAMEWORKS.map(framework => (
                          <SelectItem key={framework.id} value={framework.id}>
                            <div>
                              <div className="font-medium">{framework.name}</div>
                              <div className="text-sm text-muted-foreground">{framework.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={generateSuggestion} className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Generate Connection Guide
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Architecture Overview</CardTitle>
                <CardDescription>
                  How your {FRONTEND_FRAMEWORKS.find(f => f.id === config.frontendFramework)?.name} frontend will connect to {selectedTech?.name} backend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Globe className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Frontend</h3>
                      <p className="text-sm text-muted-foreground">
                        {FRONTEND_FRAMEWORKS.find(f => f.id === config.frontendFramework)?.name}
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg bg-primary/5">
                      <Server className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Backend API</h3>
                      <p className="text-sm text-muted-foreground">{selectedTech?.name}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Database className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Database</h3>
                      <p className="text-sm text-muted-foreground">
                        {DATABASE_TYPES.find(db => db.id === config.databaseType)?.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Connection Flow:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">1</div>
                        <div>
                          <p className="font-medium">Frontend makes HTTP requests</p>
                          <p className="text-sm text-muted-foreground">Using fetch, axios, or framework-specific HTTP client</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">2</div>
                        <div>
                          <p className="font-medium">Backend processes requests</p>
                          <p className="text-sm text-muted-foreground">{selectedTech?.name} handles routing, validation, and business logic</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">3</div>
                        <div>
                          <p className="font-medium">Database operations</p>
                          <p className="text-sm text-muted-foreground">CRUD operations with {DATABASE_TYPES.find(db => db.id === config.databaseType)?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">4</div>
                        <div>
                          <p className="font-medium">Return JSON response</p>
                          <p className="text-sm text-muted-foreground">Structured data back to frontend for UI updates</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Security Considerations:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use HTTPS for all API communications</li>
                      <li>• Implement proper authentication (JWT, sessions)</li>
                      <li>• Validate and sanitize all user inputs</li>
                      <li>• Use environment variables for sensitive data</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestion" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Connection Guide & Code Examples</h3>
              {generatedSuggestion && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(generatedSuggestion)}
                >
                  {copiedSuggestion ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copiedSuggestion ? 'Copied!' : 'Copy Guide'}
                </Button>
              )}
            </div>

            {!generatedSuggestion ? (
              <Card className="flex-1 flex items-center justify-center">
                <CardContent className="text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No Guide Generated Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure your technology stack and click "Generate Connection Guide" to see examples.
                  </p>
                  <Button onClick={() => setActiveTab('config')}>
                    Go to Setup
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex-1">
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-lg overflow-auto">
                      {generatedSuggestion}
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Additional Resources:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a 
                        href={getDocumentationLink(config.technology)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{selectedTech?.name} Docs</p>
                          <p className="text-sm text-muted-foreground">Official documentation</p>
                        </div>
                      </a>
                      <a 
                        href={getDatabaseDocumentationLink(config.databaseType)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{DATABASE_TYPES.find(db => db.id === config.databaseType)?.name} Docs</p>
                          <p className="text-sm text-muted-foreground">Database documentation</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions for documentation links
function getDocumentationLink(technology: string): string {
  const links = {
    nodejs: 'https://expressjs.com/en/starter/installing.html',
    python: 'https://fastapi.tiangolo.com/',
    php: 'https://laravel.com/docs',
    java: 'https://spring.io/guides/gs/spring-boot/',
    csharp: 'https://docs.microsoft.com/en-us/aspnet/core/'
  };
  return links[technology as keyof typeof links] || 'https://developer.mozilla.org/';
}

function getDatabaseDocumentationLink(database: string): string {
  const links = {
    postgresql: 'https://www.postgresql.org/docs/',
    mysql: 'https://dev.mysql.com/doc/',
    mongodb: 'https://docs.mongodb.com/',
    sqlite: 'https://www.sqlite.org/docs.html'
  };
  return links[database as keyof typeof links] || 'https://en.wikipedia.org/wiki/Database';
}

// Backend connection suggestion generation
function generateConnectionSuggestion(config: BackendConfig): string {
  const tech = BACKEND_TECHNOLOGIES.find(t => t.id === config.technology);
  const db = DATABASE_TYPES.find(d => d.id === config.databaseType);
  const frontend = FRONTEND_FRAMEWORKS.find(f => f.id === config.frontendFramework);

  let suggestion = `# ${tech?.name} + ${db?.name} Connection Guide\n\n`;
  suggestion += `This guide shows how to connect your ${frontend?.name} frontend to a ${tech?.name} backend with ${db?.name} database.\n\n`;

  // Backend setup
  suggestion += generateBackendSetup(config);
  
  // Database connection
  suggestion += generateDatabaseConnection(config);
  
  // API endpoints
  suggestion += generateAPIExample(config);
  
  // Frontend integration
  suggestion += generateFrontendIntegration(config);

  return suggestion;
}

// Main generation functions
function generateBackendSetup(config: BackendConfig): string {
  switch (config.technology) {
    case 'nodejs':
      return generateNodeJSSetup(config);
    case 'python':
      return generatePythonSetup(config);
    case 'php':
      return generatePHPSetup(config);
    case 'java':
      return generateJavaSetup(config);
    case 'csharp':
      return generateCSharpSetup(config);
    default:
      return '';
  }
}

function generateDatabaseConnection(config: BackendConfig): string {
  switch (config.databaseType) {
    case 'postgresql':
      return generatePostgreSQLConnection(config);
    case 'mysql':
      return generateMySQLConnection(config);
    case 'mongodb':
      return generateMongoDBConnection(config);
    case 'sqlite':
      return generateSQLiteConnection(config);
    default:
      return '';
  }
}

function generateAPIExample(config: BackendConfig): string {
  switch (config.technology) {
    case 'nodejs':
      return generateNodeJSAPI(config);
    case 'python':
      return generatePythonAPI(config);
    case 'php':
      return generatePHPAPI(config);
    case 'java':
      return generateJavaAPI(config);
    case 'csharp':
      return generateCSharpAPI(config);
    default:
      return '';
  }
}

function generateFrontendIntegration(config: BackendConfig): string {
  switch (config.frontendFramework) {
    case 'react':
      return generateReactIntegration(config);
    case 'vue':
      return generateVueIntegration(config);
    case 'angular':
      return generateAngularIntegration(config);
    case 'vanilla':
      return generateVanillaJSIntegration(config);
    default:
      return '';
  }
}

// Backend setup functions
function generateNodeJSSetup(config: BackendConfig): string {
  return `## 1. Node.js + Express Setup

### Install Dependencies
\`\`\`bash
npm init -y
npm install express cors dotenv ${getNodeJSDatabasePackage(config.databaseType)}
npm install --save-dev nodemon
\`\`\`

### Basic Server Setup (server.js)
\`\`\`javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

### Environment Variables (.env)
\`\`\`
PORT=3001
${getNodeJSEnvVars(config)}
\`\`\`

`;
}

function generatePythonSetup(config: BackendConfig): string {
  return `## 1. Python + FastAPI Setup

### Install Dependencies
\`\`\`bash
pip install fastapi uvicorn ${getPythonDatabasePackage(config.databaseType)}
\`\`\`

### Basic Server Setup (main.py)
\`\`\`python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="FullDev AI API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
\`\`\`

### Environment Variables (.env)
\`\`\`
${getPythonEnvVars(config)}
\`\`\`

`;
}

function generatePHPSetup(config: BackendConfig): string {
  return `## 1. PHP + Laravel Setup

### Create New Laravel Project
\`\`\`bash
composer create-project laravel/laravel fulldev-ai-api
cd fulldev-ai-api
\`\`\`

### Install Database Package
\`\`\`bash
${getPHPDatabaseCommand(config.databaseType)}
\`\`\`

### Basic API Setup (routes/api.php)
\`\`\`php
<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;

Route::get('/', function () {
    return response()->json(['message' => 'API is running!']);
});
\`\`\`

### CORS Configuration (config/cors.php)
\`\`\`php
<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
\`\`\`

### Environment Variables (.env)
\`\`\`
${getPHPEnvVars(config)}
\`\`\`

`;
}

function generateJavaSetup(config: BackendConfig): string {
  return `## 1. Java + Spring Boot Setup

### Create Spring Boot Project
Visit https://start.spring.io/ and generate a project with:
- Spring Web
- Spring Data JPA
- ${getJavaDatabaseDependency(config.databaseType)}

### Main Application Class
\`\`\`java
@SpringBootApplication
public class FullDevAIApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(FullDevAIApiApplication.class, args);
    }
}
\`\`\`

### Basic Controller
\`\`\`java
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ApiController {
    
    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "API is running!");
        return response;
    }
}
\`\`\`

### Application Properties (application.properties)
\`\`\`
${getJavaEnvVars(config)}
\`\`\`

`;
}

function generateCSharpSetup(config: BackendConfig): string {
  return `## 1. C# + ASP.NET Core Setup

### Create New Project
\`\`\`bash
dotnet new webapi -n FullDevAIApi
cd FullDevAIApi
dotnet add package ${getCSharpDatabasePackage(config.databaseType)}
\`\`\`

### Basic Controller
\`\`\`csharp
[ApiController]
[Route("/")]
public class HomeController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "API is running!" });
    }
}
\`\`\`

### CORS Configuration (Program.cs)
\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors();
app.MapControllers();
app.Run();
\`\`\`

### Configuration (appsettings.json)
\`\`\`json
${getCSharpEnvVars(config)}
\`\`\`

`;
}

// Database connection functions
function generatePostgreSQLConnection(config: BackendConfig): string {
  switch (config.technology) {
    case 'nodejs':
      return `## 2. PostgreSQL Connection

### Database Connection (db.js)
\`\`\`javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
\`\`\`

### Test Connection
\`\`\`javascript
const db = require('./db');

db.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to PostgreSQL:', result.rows[0]);
  }
});
\`\`\`

`;
    case 'python':
      return `## 2. PostgreSQL Connection

### Database Connection
\`\`\`python
import asyncpg
import os
from typing import List, Dict

class Database:
    def __init__(self):
        self.url = os.getenv("DATABASE_URL")
    
    async def execute_query(self, query: str, values: tuple = ()):
        conn = await asyncpg.connect(self.url)
        try:
            result = await conn.fetch(query, *values)
            return result
        finally:
            await conn.close()

db = Database()
\`\`\`

`;
    default:
      return '';
  }
}

function generateMySQLConnection(config: BackendConfig): string {
  switch (config.technology) {
    case 'nodejs':
      return `## 2. MySQL Connection

### Database Connection (db.js)
\`\`\`javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
\`\`\`

`;
    case 'python':
      return `## 2. MySQL Connection

### Database Connection
\`\`\`python
import aiomysql
import os

class Database:
    def __init__(self):
        self.config = {
            'host': os.getenv('DB_HOST'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'db': os.getenv('DB_NAME'),
        }
    
    async def execute_query(self, query: str, values: tuple = ()):
        conn = await aiomysql.connect(**self.config)
        try:
            async with conn.cursor() as cursor:
                await cursor.execute(query, values)
                result = await cursor.fetchall()
                return result
        finally:
            conn.close()

db = Database()
\`\`\`

`;
    default:
      return '';
  }
}

function generateMongoDBConnection(config: BackendConfig): string {
  switch (config.technology) {
    case 'nodejs':
      return `## 2. MongoDB Connection

### Database Connection (db.js)
\`\`\`javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
\`\`\`

### Example Schema
\`\`\`javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
\`\`\`

`;
    case 'python':
      return `## 2. MongoDB Connection

### Database Connection
\`\`\`python
from motor.motor_asyncio import AsyncIOMotorClient
import os

class Database:
    def __init__(self):
        self.client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
        self.database = self.client.fulldev_ai

    def get_collection(self, name: str):
        return self.database[name]

db = Database()
\`\`\`

`;
    default:
      return '';
  }
}

function generateSQLiteConnection(config: BackendConfig): string {
  switch (config.technology) {
    case 'nodejs':
      return `## 2. SQLite Connection

### Database Connection (db.js)
\`\`\`javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

module.exports = db;
\`\`\`

`;
    case 'python':
      return `## 2. SQLite Connection

### Database Connection
\`\`\`python
import aiosqlite
import os

class Database:
    def __init__(self):
        self.db_path = "database.sqlite"
    
    async def execute_query(self, query: str, values: tuple = ()):
        async with aiosqlite.connect(self.db_path) as db:
            async with db.execute(query, values) as cursor:
                result = await cursor.fetchall()
                return result

db = Database()
\`\`\`

`;
    default:
      return '';
  }
}

// API example functions
function generateNodeJSAPI(config: BackendConfig): string {
  return `## 3. API Endpoints Example

### Users API (routes/users.js)
\`\`\`javascript
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
router.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await db.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
\`\`\`

### Add to main server
\`\`\`javascript
app.use('/api', require('./routes/users'));
\`\`\`

`;
}

function generatePythonAPI(config: BackendConfig): string {
  return `## 3. API Endpoints Example

### Users API
\`\`\`python
from fastapi import HTTPException
from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: str

@app.get("/users")
async def get_users():
    try:
        result = await db.execute_query("SELECT * FROM users")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/users")
async def create_user(user: User):
    try:
        result = await db.execute_query(
            "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
            (user.name, user.email)
        )
        return result[0] if result else None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
\`\`\`

`;
}

function generatePHPAPI(config: BackendConfig): string {
  return `## 3. API Endpoints Example

### Users API Controller
\`\`\`php
<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use App\\Models\\User;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        $user = User::create($validated);
        return response()->json($user, 201);
    }
}
\`\`\`

### Routes (routes/api.php)
\`\`\`php
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
\`\`\`

`;
}

function generateJavaAPI(config: BackendConfig): string {
  return `## 3. API Endpoints Example

### User Entity
\`\`\`java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    
    // Constructors, getters, setters
}
\`\`\`

### User Controller
\`\`\`java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}
\`\`\`

`;
}

function generateCSharpAPI(config: BackendConfig): string {
  return `## 3. API Endpoints Example

### User Model
\`\`\`csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}
\`\`\`

### Users Controller
\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        var createdUser = await _userService.CreateUserAsync(user);
        return CreatedAtAction(nameof(GetUsers), new { id = createdUser.Id }, createdUser);
    }
}
\`\`\`

`;
}

// Frontend integration functions
function generateReactIntegration(config: BackendConfig): string {
  return `## 4. React Frontend Integration

### API Service
\`\`\`javascript
const API_BASE_URL = 'http://localhost:${getDefaultPort(config.technology)}';

export const apiService = {
  async getUsers() {
    const response = await fetch(\`\${API_BASE_URL}/api/users\`);
    return response.json();
  },

  async createUser(userData) {
    const response = await fetch(\`\${API_BASE_URL}/api/users\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
};
\`\`\`

### React Component Example
\`\`\`jsx
import React, { useState, useEffect } from 'react';
import { apiService } from './apiService';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await apiService.createUser(userData);
      setUsers([...users, newUser]);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Users</h2>
      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
\`\`\`

## 5. Security & Best Practices

- Always validate input data on both client and server
- Use HTTPS in production
- Implement proper authentication (JWT tokens, sessions)
- Add rate limiting to prevent abuse
- Use environment variables for sensitive configuration
- Implement proper error handling and logging

## 6. Next Steps

1. Set up your database schema/tables
2. Add authentication middleware
3. Implement data validation
4. Add error handling
5. Deploy to production with proper security headers

`;
}

function generateVueIntegration(config: BackendConfig): string {
  return `## 4. Vue.js Frontend Integration

### API Service (services/api.js)
\`\`\`javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:${getDefaultPort(config.technology)}/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getUsers() {
    return apiClient.get('/users');
  },
  createUser(userData) {
    return apiClient.post('/users', userData);
  },
};
\`\`\`

### Vue Component Example
\`\`\`vue
<template>
  <div>
    <h2>Users</h2>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="user in users" :key="user.id" class="user-item">
        {{ user.name }} - {{ user.email }}
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'Users',
  data() {
    return {
      users: [],
      loading: true,
    };
  },
  async mounted() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        const response = await api.getUsers();
        this.users = response.data;
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        this.loading = false;
      }
    },
    async createUser(userData) {
      try {
        const response = await api.createUser(userData);
        this.users.push(response.data);
      } catch (error) {
        console.error('Error creating user:', error);
      }
    },
  },
};
</script>
\`\`\`

`;
}

function generateAngularIntegration(config: BackendConfig): string {
  return `## 4. Angular Frontend Integration

### API Service (services/api.service.ts)
\`\`\`typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:${getDefaultPort(config.technology)}/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(\`\${this.apiUrl}/users\`);
  }

  createUser(userData: User): Observable<User> {
    return this.http.post<User>(\`\${this.apiUrl}/users\`, userData);
  }
}
\`\`\`

### Angular Component Example
\`\`\`typescript
import { Component, OnInit } from '@angular/core';
import { ApiService, User } from './services/api.service';

@Component({
  selector: 'app-users',
  template: \`
    <h2>Users</h2>
    <div *ngIf="loading">Loading...</div>
    <div *ngFor="let user of users">
      {{ user.name }} - {{ user.email }}
    </div>
  \`
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }
}
\`\`\`

`;
}

function generateVanillaJSIntegration(config: BackendConfig): string {
  return `## 4. Vanilla JavaScript Frontend Integration

### API Service (js/api.js)
\`\`\`javascript
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:${getDefaultPort(config.technology)}/api';
  }

  async request(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}

const api = new ApiService();
\`\`\`

### HTML & JavaScript Example
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Users</title>
</head>
<body>
    <h2>Users</h2>
    <div id="loading">Loading...</div>
    <div id="users-list"></div>

    <script src="js/api.js"></script>
    <script>
        async function loadUsers() {
            try {
                const users = await api.getUsers();
                displayUsers(users);
            } catch (error) {
                console.error('Error loading users:', error);
            } finally {
                document.getElementById('loading').style.display = 'none';
            }
        }

        function displayUsers(users) {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = users.map(user => 
                \`<div>\${user.name} - \${user.email}</div>\`
            ).join('');
        }

        // Load users when page loads
        loadUsers();
    </script>
</body>
</html>
\`\`\`

`;
}

// Helper functions for package names and environment variables
function getNodeJSDatabasePackage(databaseType: string): string {
  const packages = {
    postgresql: 'pg',
    mysql: 'mysql2',
    mongodb: 'mongoose',
    sqlite: 'sqlite3'
  };
  return packages[databaseType as keyof typeof packages] || 'pg';
}

function getPythonDatabasePackage(databaseType: string): string {
  const packages = {
    postgresql: 'asyncpg',
    mysql: 'aiomysql',
    mongodb: 'motor',
    sqlite: 'aiosqlite'
  };
  return packages[databaseType as keyof typeof packages] || 'asyncpg';
}

function getPHPDatabaseCommand(databaseType: string): string {
  const commands = {
    postgresql: '# Laravel supports PostgreSQL by default',
    mysql: '# Laravel supports MySQL by default',
    mongodb: 'composer require jenssegers/mongodb',
    sqlite: '# Laravel supports SQLite by default'
  };
  return commands[databaseType as keyof typeof commands] || '# Laravel supports PostgreSQL by default';
}

function getJavaDatabaseDependency(databaseType: string): string {
  const dependencies = {
    postgresql: 'PostgreSQL Driver',
    mysql: 'MySQL Driver',
    mongodb: 'Spring Data MongoDB',
    sqlite: 'SQLite Driver'
  };
  return dependencies[databaseType as keyof typeof dependencies] || 'PostgreSQL Driver';
}

function getCSharpDatabasePackage(databaseType: string): string {
  const packages = {
    postgresql: 'Npgsql.EntityFrameworkCore.PostgreSQL',
    mysql: 'MySql.EntityFrameworkCore',
    mongodb: 'MongoDB.Driver',
    sqlite: 'Microsoft.EntityFrameworkCore.Sqlite'
  };
  return packages[databaseType as keyof typeof packages] || 'Npgsql.EntityFrameworkCore.PostgreSQL';
}

function getNodeJSEnvVars(config: BackendConfig): string {
  const envVars = {
    postgresql: 'DATABASE_URL=postgresql://username:password@localhost:5432/dbname',
    mysql: 'DATABASE_URL=mysql://username:password@localhost:3306/dbname',
    mongodb: 'MONGODB_URI=mongodb://localhost:27017/dbname',
    sqlite: 'DATABASE_PATH=./database.sqlite'
  };
  return envVars[config.databaseType as keyof typeof envVars] || envVars.postgresql;
}

function getPythonEnvVars(config: BackendConfig): string {
  const envVars = {
    postgresql: 'DATABASE_URL=postgresql://username:password@localhost:5432/dbname',
    mysql: 'DB_HOST=localhost\nDB_USER=username\nDB_PASSWORD=password\nDB_NAME=dbname',
    mongodb: 'MONGODB_URI=mongodb://localhost:27017/dbname',
    sqlite: 'DATABASE_PATH=./database.sqlite'
  };
  return envVars[config.databaseType as keyof typeof envVars] || envVars.postgresql;
}

function getPHPEnvVars(config: BackendConfig): string {
  const envVars = {
    postgresql: 'DB_CONNECTION=pgsql\nDB_HOST=127.0.0.1\nDB_PORT=5432\nDB_DATABASE=dbname\nDB_USERNAME=username\nDB_PASSWORD=password',
    mysql: 'DB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=dbname\nDB_USERNAME=username\nDB_PASSWORD=password',
    mongodb: 'DB_CONNECTION=mongodb\nDB_HOST=127.0.0.1\nDB_PORT=27017\nDB_DATABASE=dbname',
    sqlite: 'DB_CONNECTION=sqlite\nDB_DATABASE=/absolute/path/to/database.sqlite'
  };
  return envVars[config.databaseType as keyof typeof envVars] || envVars.postgresql;
}

function getJavaEnvVars(config: BackendConfig): string {
  const envVars = {
    postgresql: 'spring.datasource.url=jdbc:postgresql://localhost:5432/dbname\nspring.datasource.username=username\nspring.datasource.password=password\nspring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect',
    mysql: 'spring.datasource.url=jdbc:mysql://localhost:3306/dbname\nspring.datasource.username=username\nspring.datasource.password=password\nspring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect',
    mongodb: 'spring.data.mongodb.uri=mongodb://localhost:27017/dbname',
    sqlite: 'spring.datasource.url=jdbc:sqlite:database.sqlite\nspring.jpa.database-platform=org.hibernate.dialect.SQLiteDialect'
  };
  return envVars[config.databaseType as keyof typeof envVars] || envVars.postgresql;
}

function getCSharpEnvVars(config: BackendConfig): string {
  const envVars = {
    postgresql: '{\n  "ConnectionStrings": {\n    "DefaultConnection": "Host=localhost;Database=dbname;Username=username;Password=password"\n  }\n}',
    mysql: '{\n  "ConnectionStrings": {\n    "DefaultConnection": "Server=localhost;Database=dbname;Uid=username;Pwd=password;"\n  }\n}',
    mongodb: '{\n  "ConnectionStrings": {\n    "MongoDB": "mongodb://localhost:27017/dbname"\n  }\n}',
    sqlite: '{\n  "ConnectionStrings": {\n    "DefaultConnection": "Data Source=database.sqlite"\n  }\n}'
  };
  return envVars[config.databaseType as keyof typeof envVars] || envVars.postgresql;
}

function getDefaultPort(technology: string): string {
  const ports = {
    nodejs: '3001',
    python: '8000',
    php: '8000',
    java: '8080',
    csharp: '5000'
  };
  return ports[technology as keyof typeof ports] || '3001';
}
