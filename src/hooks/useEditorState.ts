"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Ably from "ably";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from "y-protocols/awareness.js";
import * as Y from "yjs";
import type { ComponentData, EditorState } from "../types/editor";
import { getSupabaseSession } from "../supabase/auth/authService";
import { supabase } from "../supabase/config/supabaseClient";
import {
  saveProject,
  fetchProjectById,
  fetchProjectComponents,
} from "../supabase/data/projectService";

// --- localStorage initializers ---

function getInitialTheme(): "light" | "dark" | "system" {
  const savedTheme = localStorage.getItem("fulldev-ai-theme");
  if (
    savedTheme === "light" ||
    savedTheme === "dark" ||
    savedTheme === "system"
  ) {
    return savedTheme;
  }
  return "dark";
}

function getInitialUserProjectConfig() {
  const url = localStorage.getItem("target_supabase_url");
  const key = localStorage.getItem("target_supabase_key");
  if (url && key) {
    return { supabaseUrl: url, supabaseKey: key };
  }
  return { supabaseUrl: "", supabaseKey: "" };
}

function getInitialView(): EditorState["currentView"] {
  const savedView = localStorage.getItem("fulldev-ai-current-view");
  if (
    savedView === "editor" ||
    savedView === "dashboard" ||
    savedView === "admin-login" ||
    savedView === "admin"
  ) {
    return savedView;
  }
  return "landing";
}

function getInitialProjectId(): string | null {
  return localStorage.getItem("fulldev-ai-current-project-id") || null;
}

function getInitialProjectName(): string {
  return localStorage.getItem("fulldev-ai-project-name") || "Untitled Project";
}

// --- The hook ---

export function useEditorState() {
  const ydocRef = useRef<Y.Doc | null>(null);
  const yComponentsRef = useRef<Y.Array<ComponentData> | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const localChangeRef = useRef(false);
  const clientIdRef = useRef<string | null>(null);
  const userColorRef = useRef<string | null>(null);
  const cursorPosRef = useRef({ x: 0, y: 0 });

  const [remoteCursors, setRemoteCursors] = useState<
    Map<string, { clientId: string; user: any; x: number; y: number }>
  >(new Map());
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("/index.html");

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
  } | null>(null);

  const ablyKey = import.meta.env.VITE_ABLY_KEY as string | undefined;

  const encodeUpdate = (update: Uint8Array) =>
    btoa(String.fromCharCode(...Array.from(update)));

  const decodeUpdate = (data: string) =>
    Uint8Array.from(atob(data), (char) => char.charCodeAt(0));

  const getOrInitDoc = () => {
    if (!ydocRef.current) {
      ydocRef.current = new Y.Doc();
      yComponentsRef.current =
        ydocRef.current.getArray<ComponentData>("components");
      awarenessRef.current = new Awareness(ydocRef.current);
    }
    return {
      ydoc: ydocRef.current,
      yComponents: yComponentsRef.current!,
      awareness: awarenessRef.current!,
    };
  };

  const replaceComponents = (components: ComponentData[], markLocal = true) => {
    const { yComponents } = getOrInitDoc();
    if (markLocal) {
      localChangeRef.current = true;
    }
    yComponents.delete(0, yComponents.length);
    if (components.length > 0) {
      yComponents.push(components);
    }
  };

  const [state, setState] = useState<EditorState>({
    currentView: getInitialView(),
    currentPage: getInitialView(),
    components: [],
    selectedComponent: null,
    showPreview: false,
    showCodeExport: false,
    showTemplates: false,
    showAIGenerator: false,
    editorMode: "blocks",
    viewMode: "design",
    leftSidebarWidth: 280,
    rightSidebarWidth: 320,
    isLeftSidebarVisible: true,
    isRightSidebarVisible: true,
    isResizingLeftSidebar: false,
    isResizingRightSidebar: false,
    propertiesPanelVisible: true,
    aiAssistantVisible: true,
    canvasWidth: 1280,
    showMobileProperties: false,
    canvasZoom: 100,
    currentProjectId: getInitialProjectId(),
    showPublishModal: false,
    showShareModal: false,
    lastSaved: null,
    theme: getInitialTheme(),
    isCodeSyncing: true,
    isSaving: false,
    hasUnsavedChanges: false,
    isFullscreen: false,
    rightSidebarTab: "properties",
    projectName: getInitialProjectName(),
    canvasBackgroundColor: "#ffffff",
    showCanvasGrid: true,
    showAIAssistantModal: false,
    currentUser: null,
    isSupabaseConnected: false,
    userProjectConfig: getInitialUserProjectConfig(),
    projectIsPublic: null,
    projectAuthorId: null,
  });

  useEffect(() => {
    const { yComponents } = getOrInitDoc();

    const handleYComponentsChange = () => {
      const isLocal = localChangeRef.current;
      localChangeRef.current = false;
      const nextComponents = yComponents.toArray();

      setState((prev) => ({
        ...prev,
        components: nextComponents,
        hasUnsavedChanges: isLocal ? true : prev.hasUnsavedChanges,
      }));
    };

    yComponents.observe(handleYComponentsChange);
    handleYComponentsChange();

    return () => {
      yComponents.unobserve(handleYComponentsChange);
    };
  }, []);

  // ==================== AUTH ====================

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const searchParams = new URLSearchParams(window.location.search);

    const accessToken =
      hashParams.get("access_token") ||
      searchParams.get("token") ||
      searchParams.get("access_token");
    const refreshToken =
      hashParams.get("refresh_token") || searchParams.get("refresh_token");

    const isIntegrationCallback = searchParams.get("status") === "success";

    if (accessToken) {
      if (isIntegrationCallback) {
        if (accessToken) {
          localStorage.setItem("supabase_integration_token", accessToken);
        }
        localStorage.setItem("open_account_settings", "integration");
        localStorage.setItem("update_supabase_status", "true");
        window.location.href = "/dashboard";
        return;
      }

      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        })
        .then(async () => {
          window.history.replaceState({}, document.title, "/dashboard");
          setState((prev) => ({
            ...prev,
            currentView: "dashboard",
            currentPage: "dashboard",
          }));
          setIsAuthenticated(true);
          setAuthLoading(false);
        })
        .catch((err) => {
          console.error("Error setting session from URL:", err);
          setAuthLoading(false);
        });

      return;
    }

    // No token in URL, check existing session
    const checkSession = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const {
        data: { session },
      } = await getSupabaseSession();
      const loggedIn = !!session;

      let isConnected = false;
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("isConnected")
          .eq("user_id", session.user.id) // ✅ Use "user_id" not "id"
          .single();

        if (profileError) {
          console.error(
            "Error fetching profile connection status:",
            profileError,
          );
        }

        if (profile?.isConnected === 1) isConnected = true;
      }

      setIsAuthenticated(loggedIn);
      setAuthLoading(false);

      const savedView = localStorage.getItem("fulldev-ai-current-view");
      const path = window.location.pathname;

      setState((prev) => {
        let nextView = prev.currentView;

        if (path.startsWith("/editor")) {
          nextView = "editor";
        } else if (loggedIn) {
          if (savedView === "editor" || savedView === "dashboard") {
            nextView = savedView;
          } else {
            nextView = "dashboard";
          }
        } else {
          nextView = "landing";
        }

        return {
          ...prev,
          currentView: nextView,
          currentPage: nextView,
          currentUser: session?.user || null,
          isSupabaseConnected: isConnected,
        };
      });
    };

    checkSession();
  }, []);

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { session },
      } = await getSupabaseSession();
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || "",
          name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name,
          avatar_url:
            session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture,
        });
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const { awareness } = getOrInitDoc();

    if (!clientIdRef.current) {
      clientIdRef.current = `anon-${Math.random().toString(36).slice(2, 10)}`;
    }

    if (!userColorRef.current) {
      const colors = [
        "#ef4444",
        "#f59e0b",
        "#10b981",
        "#3b82f6",
        "#6366f1",
        "#ec4899",
      ];
      userColorRef.current = colors[Math.floor(Math.random() * colors.length)];
    }

    awareness.setLocalStateField("user", {
      id: currentUser?.id ?? clientIdRef.current,
      name: currentUser?.name ?? currentUser?.email ?? "Guest",
      color: userColorRef.current,
    });
  }, [currentUser]);

  // Track canvas mouse movement and publish via awareness
  const handleCanvasMouseMove = (e: MouseEvent) => {
    const { awareness } = getOrInitDoc();
    awareness.setLocalStateField("cursor", {
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Listen for awareness updates to track remote cursors
  useEffect(() => {
    const { awareness } = getOrInitDoc();

    const handleAwarenessChange = () => {
      const newCursors = new Map<string, any>();

      awareness.getStates().forEach((state: any, clientId: number) => {
        if (clientId === awareness.clientID) return;
        if (state.user && state.cursor) {
          newCursors.set(String(clientId), {
            clientId: String(clientId),
            user: state.user,
            x: state.cursor.x,
            y: state.cursor.y,
          });
        }
      });

      setRemoteCursors(newCursors);
    };

    awareness.on("change", handleAwarenessChange);
    document.addEventListener("mousemove", handleCanvasMouseMove);

    return () => {
      awareness.off("change", handleAwarenessChange);
      document.removeEventListener("mousemove", handleCanvasMouseMove);
    };
  }, []);

  // ==================== PERSISTENCE ====================

  useEffect(() => {
    if (
      state.currentView === "editor" ||
      state.currentView === "dashboard" ||
      state.currentView === "admin-login" ||
      state.currentView === "admin"
    ) {
      localStorage.setItem("fulldev-ai-current-view", state.currentView);
    } else if (state.currentView === "landing") {
      localStorage.removeItem("fulldev-ai-current-view");
    }
  }, [state.currentView]);

  useEffect(() => {
    if (state.currentProjectId) {
      localStorage.setItem(
        "fulldev-ai-current-project-id",
        state.currentProjectId,
      );
    }
  }, [state.currentProjectId]);

  useEffect(() => {
    if (state.projectName) {
      localStorage.setItem("fulldev-ai-project-name", state.projectName);
    }
  }, [state.projectName]);

  // ==================== PROJECT LOADING ====================

  useEffect(() => {
    if (!state.currentProjectId) return;

    (async () => {
      const { data: urlValidity, error: urlError } = await supabase
        .from("projects")
        .select("is_public, user_id")
        .eq("projects_id", state.currentProjectId)
        .maybeSingle();

      if (urlError || !urlValidity) {
        console.error("Project visibility check failed.", urlError);

        // If we can't read visibility, check if we can read the project itself
        // (owners can read their own projects even if the visibility query fails)
        const { data: projectCheck } = await supabase
          .from("projects")
          .select("is_public, user_id")
          .eq("projects_id", state.currentProjectId)
          .maybeSingle();

        if (projectCheck) {
          // Successfully read project details
          console.log("Fallback read succeeded:", projectCheck);
          setState((prev) => ({
            ...prev,
            projectIsPublic: !!projectCheck.is_public,
            projectAuthorId: projectCheck.user_id || null,
          }));
        } else {
          // Can't read anything, treat as private
          console.log("No access to project");
          setState((prev) => ({
            ...prev,
            projectIsPublic: false,
            projectAuthorId: null,
          }));
        }
        return;
      }

      console.log("Visibility check succeeded:", urlValidity);
      setState((prev) => ({
        ...prev,
        projectIsPublic: !!urlValidity?.is_public,
        projectAuthorId: urlValidity?.user_id || null,
      }));
    })();
  }, [state.currentProjectId]);

  useEffect(() => {
    const shouldLoad =
      state.currentView === "editor" && !!state.currentProjectId;
    if (!shouldLoad) return;
    if (state.components.length > 0) return;
    (async () => {
      const { data: projectData, error: projectError } = await fetchProjectById(
        state.currentProjectId!,
      );

      if (!projectError && projectData) {
        const { data: componentsData } = await fetchProjectComponents(
          state.currentProjectId!,
        );

        const loadedComponents =
          componentsData && componentsData.length > 0
            ? componentsData
            : (projectData.project_layout as any[]) || [];

        replaceComponents(loadedComponents, false);
        setState((prev) => ({
          ...prev,
          projectName: projectData.name || prev.projectName,
        }));
      }
    })();
  }, [state.currentView, state.currentProjectId]);

  useEffect(() => {
    const { ydoc, awareness } = getOrInitDoc();
    const roomId = state.currentProjectId;

    if (!ablyKey || !roomId || state.currentView !== "editor") {
      return;
    }

    if (!clientIdRef.current) {
      clientIdRef.current = `anon-${Math.random().toString(36).slice(2, 10)}`;
    }

    const client = new Ably.Realtime({
      key: ablyKey,
      clientId: clientIdRef.current,
    });
    const channel = client.channels.get(`collab:${roomId}`);

    let updateTimeout: NodeJS.Timeout | null = null;
    let pendingUpdates: Uint8Array[] = [];

    const handleDocUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === "remote") return;
      pendingUpdates.push(update);
      if (updateTimeout) clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        if (pendingUpdates.length > 0) {
          const merged = Y.encodeStateAsUpdate(ydoc);
          channel.publish("yjs-update", encodeUpdate(merged));
          pendingUpdates = [];
        }
      }, 300);
    };

    const handleRemoteUpdate = (message: { data: string }) => {
      if (!message?.data) return;
      const update = decodeUpdate(String(message.data));
      Y.applyUpdate(ydoc, update, "remote");
    };

    const handleSyncRequest = () => {
      const fullUpdate = Y.encodeStateAsUpdate(ydoc);
      channel.publish("yjs-sync", encodeUpdate(fullUpdate));
    };

    let awarenessTimeout: NodeJS.Timeout | null = null;

    const handleAwarenessUpdate = ({
      added,
      updated,
      removed,
    }: {
      added: number[];
      updated: number[];
      removed: number[];
    }) => {
      if (awarenessTimeout) clearTimeout(awarenessTimeout);
      awarenessTimeout = setTimeout(() => {
        const changed = added.concat(updated, removed);
        if (changed.length > 0) {
          const update = encodeAwarenessUpdate(awareness, changed);
          channel.publish("yjs-awareness", encodeUpdate(update));
        }
      }, 60);
    };

    const handleRemoteAwareness = (message: { data: string }) => {
      if (!message?.data) return;
      const update = decodeUpdate(String(message.data));
      applyAwarenessUpdate(awareness, update, "remote");
    };

    ydoc.on("update", handleDocUpdate);
    awareness.on("update", handleAwarenessUpdate);

    channel.subscribe("yjs-update", handleRemoteUpdate);
    channel.subscribe("yjs-sync", handleRemoteUpdate);
    channel.subscribe("yjs-request-sync", handleSyncRequest);
    channel.subscribe("yjs-awareness", handleRemoteAwareness);

    channel.publish("yjs-request-sync", { clientId: clientIdRef.current });

    return () => {
      if (updateTimeout) clearTimeout(updateTimeout);
      if (awarenessTimeout) clearTimeout(awarenessTimeout);
      channel.unsubscribe("yjs-update", handleRemoteUpdate);
      channel.unsubscribe("yjs-sync", handleRemoteUpdate);
      channel.unsubscribe("yjs-request-sync", handleSyncRequest);
      channel.unsubscribe("yjs-awareness", handleRemoteAwareness);
      ydoc.off("update", handleDocUpdate);
      awareness.off("update", handleAwarenessUpdate);
      channel.detach();
      client.close();
    };
  }, [ablyKey, state.currentProjectId, state.currentView]);

  // ==================== AUTO-SAVE ====================

  useEffect(() => {
    if (!state.hasUnsavedChanges || state.currentView !== "editor") {
      return;
    }

    const autoSaveTimer = setTimeout(async () => {
      if (!state.currentProjectId) return;

      setState((prev) => ({ ...prev, isSaving: true }));

      try {
        const {
          data: { session },
        } = await getSupabaseSession();
        const user_id = session?.user?.id;

        if (user_id) {
          // Get current components from Yjs
          const { yComponents } = getOrInitDoc();
          const currentComponents = yComponents.toArray();

          await saveProject({
            id: state.currentProjectId,
            name: state.projectName || "Untitled Project",
            user_id,
            project_layout: currentComponents,
          });
        }

        setState((prev) => ({
          ...prev,
          isSaving: false,
          hasUnsavedChanges: false,
          lastSaved: new Date(),
        }));
      } catch (error) {
        console.error("Auto-save error:", error);
        setState((prev) => ({ ...prev, isSaving: false }));
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [
    state.components,
    state.hasUnsavedChanges,
    state.currentView,
    state.currentProjectId,
    state.projectName,
  ]);

  // ==================== THEME ====================

  useEffect(() => {
    const root = document.documentElement;

    if (state.currentView === "landing") {
      root.classList.remove("dark");
      return;
    }

    const applyTheme = () => {
      if (state.theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.toggle("dark", systemTheme === "dark");
      } else {
        root.classList.toggle("dark", state.theme === "dark");
      }
    };

    applyTheme();

    if (state.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [state.theme, state.currentView]);

  // ==================== COMPONENT OPERATIONS ====================

  const addComponent = (component: ComponentData) => {
    const { yComponents } = getOrInitDoc();
    localChangeRef.current = true;
    const newComponent = {
      ...component,
      id: component.id || Date.now().toString(),
      position: component.position || { x: 150, y: 150 },
    };
    yComponents.push([newComponent]);
  };

  const updateComponent = (id: string, updates: Partial<ComponentData>) => {
    const { yComponents } = getOrInitDoc();
    const index = yComponents.toArray().findIndex((comp) => comp.id === id);
    if (index === -1) return;
    localChangeRef.current = true;
    const existing = yComponents.get(index) as ComponentData;
    const updated = {
      ...existing,
      ...updates,
      props: updates.props
        ? { ...existing.props, ...updates.props }
        : existing.props,
      style: updates.style
        ? { ...existing.style, ...updates.style }
        : existing.style,
      position: updates.position
        ? { ...existing.position, ...updates.position }
        : existing.position,
    };
    yComponents.delete(index, 1);
    yComponents.insert(index, [updated]);
  };

  const deleteComponent = (id: string) => {
    const { yComponents } = getOrInitDoc();
    const index = yComponents.toArray().findIndex((comp) => comp.id === id);
    if (index === -1) return;
    localChangeRef.current = true;
    yComponents.delete(index, 1);
    setState((prev) => ({
      ...prev,
      selectedComponent:
        prev.selectedComponent === id ? null : prev.selectedComponent,
    }));
  };

  const selectComponent = (component: ComponentData | null) => {
    setState((prev) => ({
      ...prev,
      selectedComponent: component ? component.id : null,
      showMobileProperties: component !== null && window.innerWidth < 768,
    }));
  };

  const reorderComponent = (dragId: string, dropId: string) => {
    const { yComponents } = getOrInitDoc();
    const components = yComponents.toArray();
    const dragIndex = components.findIndex((c) => c.id === dragId);
    const dropIndex = components.findIndex((c) => c.id === dropId);

    if (dragIndex === -1 || dropIndex === -1) return;

    localChangeRef.current = true;
    const [dragged] = components.splice(dragIndex, 1);
    components.splice(dropIndex, 0, dragged);
    yComponents.delete(0, yComponents.length);
    yComponents.push(components);
  };

  const clearCanvas = () => {
    replaceComponents([]);
    setState((prev) => ({
      ...prev,
      selectedComponent: null,
    }));
  };

  // ==================== TOGGLE HELPERS ====================

  const togglePreview = () =>
    setState((prev) => ({ ...prev, showPreview: !prev.showPreview }));
  const toggleCodeExport = () =>
    setState((prev) => ({ ...prev, showCodeExport: !prev.showCodeExport }));
  const toggleTemplates = () =>
    setState((prev) => ({ ...prev, showTemplates: !prev.showTemplates }));
  const togglePublishModal = () =>
    setState((prev) => ({ ...prev, showPublishModal: !prev.showPublishModal }));
  const toggleShareModal = () =>
    setState((prev) => ({ ...prev, showShareModal: !prev.showShareModal }));
  const toggleEditorMode = () =>
    setState((prev) => ({
      ...prev,
      editorMode: prev.editorMode === "blocks" ? "dual-pane" : "blocks",
    }));
  const togglePropertiesPanel = () =>
    setState((prev) => ({
      ...prev,
      propertiesPanelVisible: !prev.propertiesPanelVisible,
    }));
  const toggleCodeSync = () =>
    setState((prev) => ({ ...prev, isCodeSyncing: !prev.isCodeSyncing }));
  const toggleMobileProperties = () =>
    setState((prev) => ({
      ...prev,
      showMobileProperties: !prev.showMobileProperties,
    }));

  const toggleAIAssistant = () => {
    setState((prev) => ({
      ...prev,
      aiAssistantVisible: !prev.aiAssistantVisible,
      showAIAssistantModal: !prev.showAIAssistantModal,
    }));
  };

  // ==================== NAVIGATION ====================

  const enterDashboard = () =>
    setState((prev) => ({
      ...prev,
      currentView: "dashboard",
      currentPage: "dashboard",
    }));
  const enterEditor = () =>
    setState((prev) => ({
      ...prev,
      currentView: "editor",
      currentPage: "editor",
    }));
  const goToLanding = () =>
    setState((prev) => ({
      ...prev,
      currentView: "landing",
      currentPage: "landing",
    }));
  const goToDashboard = () =>
    setState((prev) => ({
      ...prev,
      currentView: "dashboard",
      currentPage: "dashboard",
      currentProjectId: null,
    }));
  const goToAdminLogin = () =>
    setState((prev) => ({
      ...prev,
      currentView: "admin-login",
      currentPage: "admin-login",
    }));
  const goToAdmin = () =>
    setState((prev) => ({
      ...prev,
      currentView: "admin",
      currentPage: "admin",
    }));

  // ==================== PROJECT OPERATIONS ====================

  const createFromScratch = () => {
    replaceComponents([]);
    setState((prev) => ({
      ...prev,
      currentView: "editor",
      currentPage: "editor",
      selectedComponent: null,
      currentProjectId: null,
      projectName: "Untitled Project",
      hasUnsavedChanges: false,
    }));
  };

  const openProject = (projectId: string, projectName?: string) => {
    replaceComponents([], false);
    setState((prev) => ({
      ...prev,
      currentView: "editor",
      currentPage: "editor",
      currentProjectId: projectId,
      projectName: projectName ?? "Untitled Project",
      selectedComponent: null,
      hasUnsavedChanges: false,
    }));
    localStorage.setItem("fulldev-ai-current-project-id", projectId);
    if (projectName) {
      localStorage.setItem("fulldev-ai-project-name", projectName);
    }
  };

  const updateProjectName = (name: string) => {
    setState((prev) => ({
      ...prev,
      projectName: name,
      hasUnsavedChanges: true,
    }));
    localStorage.setItem("fulldev-ai-project-name", name);
  };

  const updateUserProjectConfig = (url: string, key: string) => {
    const config = { supabaseUrl: url, supabaseKey: key };
    localStorage.setItem(
      "fulldev-ai-user-project-config",
      JSON.stringify(config),
    );
    setState((prev) => ({ ...prev, userProjectConfig: config }));
  };

  // ==================== TEMPLATE LOADING ====================

  const loadTemplate = async (template: ComponentData[]) => {
    const centerX = 500;
    const centerY = 300;
    let currentY = centerY;

    const newComponents = template.map((comp) => {
      const height =
        Number.parseFloat(
          String(comp.style?.height || "100").replace("px", ""),
        ) || 100;
      const width =
        Number.parseFloat(
          String(comp.style?.width || "600").replace("px", ""),
        ) || 600;

      const position = comp.position || { x: centerX - width / 2, y: currentY };
      currentY += height + 20;

      return { ...comp, id: Date.now().toString() + Math.random(), position };
    });

    try {
      let projectId = state.currentProjectId;
      const {
        data: { session },
      } = await getSupabaseSession();
      const user_id = session?.user?.id;

      if (user_id) {
        const payloadBase = {
          name: state.projectName || "Untitled Project",
          user_id,
          project_layout: newComponents,
        };

        if (!projectId) {
          const { data, error } = await saveProject(payloadBase);
          if (!error && data) {
            projectId = data.id;
          } else {
            console.error("Error creating project from template:", error);
          }
        } else {
          const { error } = await saveProject({
            ...payloadBase,
            id: projectId,
          });
          if (error) {
            console.error("Error updating project with template:", error);
          }
        }
      }

      replaceComponents(newComponents);
      setState((prev) => ({
        ...prev,
        showTemplates: false,
        currentView: "editor",
        currentPage: "editor",
        currentProjectId: projectId ?? prev.currentProjectId,
        hasUnsavedChanges: true,
      }));
    } catch (e) {
      console.error("Unexpected error applying template:", e);
      replaceComponents(newComponents);
      setState((prev) => ({
        ...prev,
        showTemplates: false,
        currentView: "editor",
        currentPage: "editor",
        hasUnsavedChanges: true,
      }));
    }
  };

  // ==================== THEME & VIEW ====================

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setState((prev) => ({ ...prev, theme }));
    localStorage.setItem("fulldev-ai-theme", theme);
  };

  const handleViewModeChange = (viewMode: "design" | "code") => {
    setState((prev) => ({ ...prev, viewMode }));
  };

  const setCanvasZoom = (zoom: number) => {
    setState((prev) => ({
      ...prev,
      canvasZoom: Math.max(50, Math.min(200, zoom)),
    }));
  };

  const updateCanvasBackground = (color: string) => {
    setState((prev) => ({ ...prev, canvasBackgroundColor: color }));
  };

  const toggleCanvasGrid = (show: boolean) => {
    setState((prev) => ({ ...prev, showCanvasGrid: show }));
  };

  // ==================== SAVE ====================

  const handleManualSave = async () => {
    if (!state.currentProjectId) return;
    setState((prev) => ({ ...prev, isSaving: true }));

    try {
      const {
        data: { session },
      } = await getSupabaseSession();
      const user_id = session?.user?.id;

      if (user_id) {
        // Get current components from Yjs
        const { yComponents } = getOrInitDoc();
        const currentComponents = yComponents.toArray();

        await saveProject({
          id: state.currentProjectId,
          name: state.projectName || "Untitled Project",
          user_id,
          project_layout: currentComponents,
        });

        setState((prev) => ({
          ...prev,
          isSaving: false,
          hasUnsavedChanges: false,
          lastSaved: new Date(),
        }));
      } else {
        setState((prev) => ({ ...prev, isSaving: false }));
      }
    } catch (error) {
      console.error("Manual save error:", error);
      setState((prev) => ({ ...prev, isSaving: false }));
    }
  };

  // ==================== FULLSCREEN ====================

  const toggleFullscreen = () => {
    setState((prev) => ({ ...prev, isFullscreen: !prev.isFullscreen }));
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log("Fullscreen request failed:", err);
        });
      } else {
        document.exitFullscreen().catch((err) => {
          console.log("Exit fullscreen failed:", err);
        });
      }
    } catch (err) {
      console.log("Fullscreen not supported or blocked:", err);
    }
  };

  // ==================== PUBLISH / SHARE / EXPORT ====================

  const handlePublishTemplate = (isPublic: boolean) => {
    console.log("Publishing template as:", isPublic ? "public" : "private");
  };

  const handlePublish = () => {
    // Implement publish logic
  };

  const handleShare = () => {
    // Implement share logic
  };

  const handleExport = () => {
    // Implement export logic
  };

  // ==================== SIDEBAR RESIZE ====================

  const handleLeftSplitterMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isResizingLeftSidebar: true }));
  };

  const handleRightSplitterMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isResizingRightSidebar: true }));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (state.isResizingLeftSidebar) {
        const newWidth = e.clientX;
        if (newWidth >= 0 && newWidth <= 600) {
          setState((prev) => ({ ...prev, leftSidebarWidth: newWidth }));
        }
      } else if (state.isResizingRightSidebar) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 0 && newWidth <= 600) {
          setState((prev) => ({ ...prev, rightSidebarWidth: newWidth }));
        }
      }
    };

    const handleMouseUp = () => {
      setState((prev) => ({
        ...prev,
        isResizingLeftSidebar: false,
        isResizingRightSidebar: false,
      }));
    };

    if (state.isResizingLeftSidebar || state.isResizingRightSidebar) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [state.isResizingLeftSidebar, state.isResizingRightSidebar]);

  // ==================== KEYBOARD SHORTCUTS ====================

  useEffect(() => {
    const handleAddComponent = (event: CustomEvent) => {
      addComponent(event.detail);
    };
    window.addEventListener(
      "addComponent",
      handleAddComponent as EventListener,
    );
    return () => {
      window.removeEventListener(
        "addComponent",
        handleAddComponent as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      if (state.isFullscreen !== isCurrentlyFullscreen) {
        setState((prev) => ({ ...prev, isFullscreen: isCurrentlyFullscreen }));
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [state.isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === "F11") {
        event.preventDefault();
        toggleFullscreen();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "P"
      ) {
        event.preventDefault();
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "A"
      ) {
        event.preventDefault();
        toggleAIAssistant();
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "R"
      ) {
        event.preventDefault();
        setState((prev) => ({
          ...prev,
          propertiesPanelVisible: !prev.propertiesPanelVisible,
          aiAssistantVisible: !prev.aiAssistantVisible,
        }));
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "e") {
        event.preventDefault();
        toggleEditorMode();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleManualSave();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        togglePreview();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "n") {
        event.preventDefault();
        clearCanvas();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "o") {
        event.preventDefault();
        toggleTemplates();
      }

      if (event.key === "Delete" && state.selectedComponent) {
        event.preventDefault();
        deleteComponent(state.selectedComponent);
      }

      if (event.key === "Escape") {
        event.preventDefault();
        selectComponent(null);
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "=" &&
        window.innerWidth >= 768
      ) {
        event.preventDefault();
        setState((prev) => ({
          ...prev,
          canvasZoom: Math.min(prev.canvasZoom + 10, 200),
        }));
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "-" &&
        window.innerWidth >= 768
      ) {
        event.preventDefault();
        setState((prev) => ({
          ...prev,
          canvasZoom: Math.max(prev.canvasZoom - 10, 50),
        }));
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "0" &&
        window.innerWidth >= 768
      ) {
        event.preventDefault();
        setState((prev) => ({ ...prev, canvasZoom: 100 }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.selectedComponent]);

  // ==================== RETURN ====================

  return {
    // State
    state,
    setState,
    authLoading,
    isAuthenticated,
    selectedFile,
    setSelectedFile,
    currentUser,
    remoteCursors,

    // Component operations
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    reorderComponent,
    clearCanvas,

    // Toggles
    togglePreview,
    toggleCodeExport,
    toggleTemplates,
    togglePublishModal,
    toggleShareModal,
    toggleEditorMode,
    togglePropertiesPanel,
    toggleCodeSync,
    toggleMobileProperties,
    toggleAIAssistant,
    toggleFullscreen,
    toggleCanvasGrid,

    // Navigation
    enterDashboard,
    enterEditor,
    goToLanding,
    goToDashboard,
    goToAdminLogin,
    goToAdmin,

    // Project
    createFromScratch,
    openProject,
    updateProjectName,
    updateUserProjectConfig,
    loadTemplate,

    // Theme & view
    handleThemeChange,
    handleViewModeChange,
    setCanvasZoom,
    updateCanvasBackground,

    // Save & publish
    handleManualSave,
    handlePublishTemplate,
    handlePublish,
    handleShare,
    handleExport,

    // Sidebar resize
    handleLeftSplitterMouseDown,
    handleRightSplitterMouseDown,
  };
}
