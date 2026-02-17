import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Copy, Download, X } from "lucide-react";
import { ComponentData } from "../App";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface CodeExportModalProps {
  components: ComponentData[];
  onClose: () => void;
}

const toKebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

const styleObjToCss = (obj?: Record<string, any>) => {
  if (!obj || typeof obj !== "object") return "";
  return Object.entries(obj)
    .map(([k, v]) => `${toKebab(k)}: ${v};`)
    .join(" ");
};

export function CodeExportModal({ components, onClose }: CodeExportModalProps) {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");

  // generate consistent className for component
  const getClassName = (comp: ComponentData, idx: number) =>
    comp.props?.className || `component-${comp.type}-${comp.id ?? idx}`;

  const generateHTML = () => {
    const componentHTML = components
      .map((comp, idx) => {
        const cls = getClassName(comp, idx);
        switch (comp.type) {
          case "text":
            return `    <p class="${cls} text">${comp.props?.content || "Sample text"}</p>`;
          case "heading": {
            const level = comp.props?.level || 1;
            return `    <h${level} class="${cls} heading">${comp.props?.content || "Heading"}</h${level}>`;
          }
          case "button":
            return `    <button class="${cls} btn btn-${comp.props?.variant || "default"}">${comp.props?.text || "Button"}</button>`;
          case "image":
            return `    <img class="${cls}" src="${comp.props?.src || ""}" alt="${comp.props?.alt || ""}" width="${comp.props?.width || 300}" height="${comp.props?.height || 200}" />`;
          case "navbar": {
            const links = (comp.props?.links || ["Home", "About", "Contact"])
              .map((l: string) => `        <a href="#" class="nav-link">${l}</a>`)
              .join("\n");
            return `    <nav class="${cls} navbar">
      <div class="nav-brand">${comp.props?.brand || "Brand"}</div>
      <div class="nav-links">
${links}
      </div>
    </nav>`;
          }
          case "hero":
            return `    <section class="${cls} hero">
      <h1>${comp.props?.title || "Welcome"}</h1>
      <p>${comp.props?.subtitle || ""}</p>
    </section>`;
          case "card":
            return `    <div class="${cls} card">
      <h3>${comp.props?.title || "Card Title"}</h3>
      <p>${comp.props?.content || "Card content"}</p>
    </div>`;
          case "input":
            return `    <input class="${cls} input" type="${comp.props?.type || "text"}" placeholder="${comp.props?.placeholder || ""}" />`;
          case "footer":
            return `    <footer class="${cls} footer">
      <p>${comp.props?.copyright || "© Company"}</p>
    </footer>`;
          case "grid": {
            const cols = comp.props?.columns || 3;
            const items = Array.from({ length: cols })
              .map((_, i) => `        <div class="grid-item">Item ${i + 1}</div>`)
              .join("\n");
            return `    <div class="${cls} grid grid-cols-${cols}">
${items}
    </div>`;
          }
          default:
            return `    <div class="${cls}">Unknown component: ${comp.type}</div>`;
        }
      })
      .join("\n\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Generated Project</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <div class="container">
${componentHTML || "    <!-- No components added -->"}
  </div>

  <script src="js/main.js"></script>
</body>
</html>`;
  };

  const generateCSS = () => {
    const base = `/* Reset & base styles */
*{box-sizing:border-box}
body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto;line-height:1.6;color:#111;background:#f8fafc}
.container{max-width:1100px;margin:0 auto;padding:24px}
.btn{padding:10px 16px;border-radius:8px;border:0;cursor:pointer;font-size:14px}
.btn-primary{background:#2563eb;color:#fff}
.heading{font-size:clamp(1.25rem,2.5vw,2rem);margin:0 0 16px;font-weight:600}
.card{background:#fff;padding:16px;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.text{margin:0 0 12px;line-height:1.6}
.input{padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;font-family:inherit}`;

    const componentRules = components
      .map((comp, idx) => {
        const cls = getClassName(comp, idx);
        if (comp.style && typeof comp.style === "object") {
          const css = styleObjToCss(comp.style);
          if (css) return `.${cls}{${css}}`;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n");

    return `${base}\n\n/* Component-specific styles */\n${componentRules || "/* No component-specific styles */"}`;
  };

  const generateJS = () => {
    return `// Generated script
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.btn').forEach(b => {
    if (!b.type || b.type !== 'submit') {
      b.addEventListener('click', () => console.log('Button clicked'))
    }
  })
})`;
  };

  const generateSchema = () => {
    return `-- schema.sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
  };

  const getCode = useMemo(() => {
    return {
      html: generateHTML(),
      css: generateCSS(),
      js: generateJS(),
      schema: generateSchema(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getCode[activeTab]);
      toast.success("Code copied to clipboard!");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const downloadFile = () => {
    const map: Record<string, string> = { html: "index.html", css: "css/style.css", js: "js/main.js" };
    const filename = map[activeTab] || "file.txt";
    const code = getCode[activeTab];

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded!`);
  };

  const downloadAll = async () => {
    try {
      const zip = new JSZip();
      zip.file("index.html", getCode.html);
      zip.folder("css")?.file("style.css", getCode.css);
      zip.folder("js")?.file("main.js", getCode.js);
      zip.folder("database")?.file("schema.sql", getCode.schema);

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "export.zip");
      toast.success("export.zip downloaded");
    } catch {
      toast.error("Failed to create zip");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl w-[95vw] h-[85vh] p-0 gap-0 flex flex-col overflow-hidden"
        aria-describedby="export-code-description"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Export Code</DialogTitle>
          <DialogDescription id="export-code-description">Export your design as HTML/CSS/JS</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between px-6 py-4 border-b bg-card flex-shrink-0">
          <h2 className="text-lg font-semibold">Export Code</h2>

          {/* Single close button (only one X) */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>

            <Button variant="outline" size="sm" onClick={downloadFile}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>

            <Button size="sm" onClick={downloadAll} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-1" />
              Download All
            </Button>

          
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col flex-1 min-h-0">
          <div className="px-6 pt-4 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-3 h-10">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="html" className="flex-1 min-h-0 m-0 p-6 pt-4">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto h-full text-sm font-mono whitespace-pre-wrap">
              <code>{getCode.html}</code>
            </pre>
          </TabsContent>

          <TabsContent value="css" className="flex-1 min-h-0 m-0 p-6 pt-4">
            <pre className="bg-gray-900 text-blue-300 p-4 rounded-lg overflow-auto h-full text-sm font-mono whitespace-pre-wrap">
              <code>{getCode.css}</code>
            </pre>
          </TabsContent>

          <TabsContent value="js" className="flex-1 min-h-0 m-0 p-6 pt-4">
            <pre className="bg-gray-900 text-yellow-300 p-4 rounded-lg overflow-auto h-full text-sm font-mono whitespace-pre-wrap">
              <code>{getCode.js}</code>
            </pre>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
