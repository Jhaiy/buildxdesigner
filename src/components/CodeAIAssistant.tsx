import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CodeAIAssistantProps {
  fileName: string;
  onClose?: () => void;
}

export function CodeAIAssistant({ fileName, onClose }: CodeAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your AI coding assistant. I can help you with:
• Code explanations and documentation
• Bug fixes and optimization suggestions  
• TypeScript and React best practices
• Component refactoring ideas

What would you like help with in ${fileName}?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Auto-reply with faster response time (500ms)
    setTimeout(() => {
      const responses = [
        `I'll help you with that! Here's what I suggest:

\`\`\`typescript
// Improved code example
const optimizedFunction = () => {
  return data.map(item => ({
    ...item,
    processed: true
  }));
};

// Usage
const result = optimizedFunction();
\`\`\`

This approach is better because it follows React best practices and uses functional programming patterns.`,
        
        `Great question! For this TypeScript interface, consider adding proper type annotations:

\`\`\`typescript
interface Props {
  data: string[];
  onSelect: (item: string) => void;
  isLoading?: boolean;
}

const MyComponent: React.FC<Props> = ({ data, onSelect, isLoading = false }) => {
  return (
    <div className="component">
      {isLoading ? 'Loading...' : data.map(item => (
        <button key={item} onClick={() => onSelect(item)}>
          {item}
        </button>
      ))}
    </div>
  );
};
\`\`\``,
        
        `To optimize this component, I recommend:

1. Use React.memo() for performance
2. Extract complex logic into custom hooks
3. Add proper error boundaries

\`\`\`typescript
// Custom hook example
const useDataFetcher = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};
\`\`\`

Would you like me to show you more examples?`,
        
        `Here's how you can improve the code structure:

\`\`\`javascript
// Bad approach
function handleClick() {
  const data = fetchData();
  processData(data);
  updateUI(data);
}

// Better approach with separation of concerns
const useDataHandler = () => {
  const [data, setData] = useState(null);
  
  const handleClick = useCallback(async () => {
    const result = await fetchData();
    const processed = processData(result);
    setData(processed);
  }, []);
  
  return { data, handleClick };
};
\`\`\`

Key improvements:
• Separation of concerns
• Async/await for better readability
• useCallback for performance
• Proper state management

Let me know if you would like specific examples!`,
        
        `Here's a complete example of a well-structured React component:

\`\`\`tsx
import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4">
      {users.map(user => (
        <Card key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </Card>
      ))}
    </div>
  );
};

export default UserList;
\`\`\`

This follows best practices with proper TypeScript types, error handling, and clean code structure!`,
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const highlightCode = (code: string, language: string) => {
    // Simple syntax highlighting for common languages
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'async', 'await', 'import', 'export', 'default', 'from', 'useState', 'useEffect', 'useCallback', 'useMemo', 'React', 'FC', 'try', 'catch', 'finally', 'throw', 'new'];
    const types = ['string', 'number', 'boolean', 'void', 'any', 'unknown', 'never', 'null', 'undefined'];
    
    let highlighted = code;
    
    // Highlight comments
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-green-400">$1</span>');
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-green-400">$1</span>');
    
    // Highlight strings
    highlighted = highlighted.replace(/(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="text-orange-300">$1</span>');
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-purple-400">$1</span>');
    });
    
    // Highlight types
    types.forEach(type => {
      const regex = new RegExp(`\\b(${type})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-blue-400">$1</span>');
    });
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-yellow-300">$1</span>');
    
    // Highlight function names
    highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="text-cyan-300">$1</span>(');
    
    return highlighted;
  };

  const formatMessageContent = (content: string) => {
    // Simple code block detection
    const parts = content.split('```');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Code block
        const lines = part.split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');
        const highlightedCode = highlightCode(code, language);
        
        return (
          <div key={index} className="my-2 w-full">
            <div className="bg-slate-900 dark:bg-slate-950 rounded-md border border-slate-700 overflow-hidden">
              {language && (
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-700 bg-slate-800">
                  <span className="text-xs font-medium text-slate-400 uppercase">{language}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 rounded hover:bg-slate-700"
                  >
                    Copy
                  </button>
                </div>
              )}
              <div className="overflow-x-auto">
                <code 
                  className="text-xs font-mono leading-relaxed block p-3"
                  style={{ 
                    whiteSpace: 'pre',
                    display: 'block'
                  }}
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              </div>
            </div>
          </div>
        );
      }
      // Regular text
      return part.split("\n").map((line, lineIndex) => {
        if (line.startsWith('•')) {
          return (
            <div key={`${index}-${lineIndex}`} className="flex gap-2 my-1">
              <span className="text-blue-500 flex-shrink-0">•</span>
              <span className="flex-1 break-words">{line.substring(1).trim()}</span>
            </div>
          );
        }
        if (line.match(/^\d+\./)) {
          return (
            <div key={`${index}-${lineIndex}`} className="my-1 ml-4 break-words">
              {line}
            </div>
          );
        }
        return line ? <p key={`${index}-${lineIndex}`} className="my-1 break-words">{line}</p> : null;
      });
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b bg-muted/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-medium">AI Assistant</h3>
            <p className="text-[10px] text-muted-foreground">Powered by BuildX Designer</p>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable area that takes remaining space */}
      <div className="flex-1 overflow-hidden min-h-0">
        <ScrollArea className="h-full">
          <div className="px-3 py-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${ 
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`rounded-lg px-2.5 py-2 max-w-[calc(100%-2rem)] ${ 
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="text-xs break-words">
                    {message.role === 'assistant' 
                      ? formatMessageContent(message.content)
                      : <span className="break-words">{message.content}</span>
                    }
                  </div>
                  <div className={`text-[10px] opacity-60 mt-1 ${message.role === 'user' ? 'text-white' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-medium">You</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input - Fixed at bottom */}
      <div className="p-3 border-t bg-card flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about your code..."
            className="flex-1 text-xs h-8"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 h-8 w-8 p-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
