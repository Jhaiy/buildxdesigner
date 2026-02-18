"use client";

/*
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ REFACTOR PLAN: Split into 3 modules                                       │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ MODULE 1: src/services/collaboration/collabDoc.ts                          │
 * │ ──────────────────────────────────────────────────────────────────────────│
 * │ Purpose: Yjs CRDT document lifecycle + component mutations                │
 * │ Extract:                                                                   │
 * │   - Lines 56-79:  getOrInitDoc(), replaceComponents()                     │
 * │   - Lines 330-432: addComponent(), updateComponent(), deleteComponent(),  │
 * │                    selectComponent(), reorderComponent(), clearCanvas()   │
 * │   - Refs: ydocRef, yComponentsRef, awarenessRef, localChangeRef           │
 * │ Exports:                                                                   │
 * │   - createCollabDoc(setState) -> object with all mutation methods         │
 * │                                                                            │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ MODULE 2: src/services/collaboration/collabTransport.ts                    │
 * │ ──────────────────────────────────────────────────────────────────────────│
 * │ Purpose: Ably realtime pub/sub transport (WebSocket layer)                │
 * │ Extract:                                                                   │
 * │   - Lines 56-62:  encodeUpdate(), decodeUpdate() binary codecs            │
 * │   - Lines 201-299: Entire Ably effect (channel subscribe/publish)         │
 * │ Exports:                                                                   │
 * │   - connectAblyTransport(ydoc, awareness, roomId, ablyKey) -> cleanup fn  │
 * │                                                                            │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                            │
 * │ MODULE 3: src/services/collaboration/useCollaboration.ts (this file)      │
 * │ ──────────────────────────────────────────────────────────────────────────│
 * │ Purpose: React hook glue (effects + state bridge)                         │
 * │ Keep:                                                                      │
 * │   - Lines 82-106:  Yjs→React bridge effect                                │
 * │   - Lines 108-133: Awareness identity bootstrap                           │
 * │   - Lines 135-172: Cursor publish + awareness→UI mapping                  │
 * │   - Lines 174-199: Project hydration from DB                              │
 * │   - Lines 301-328: Auto-save effect                                       │
 * │   - remoteCursors state                                                   │
 * │   - clientIdRef, userColorRef (awareness identity)                        │
 * │ Import from modules 1 & 2, wire with useEffect                            │
 * │                                                                            │
 * └────────────────────────────────────────────────────────────────────────────┘
 */

import type React from "react";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import Ably from "ably";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from "y-protocols/awareness.js";
import * as Y from "yjs";
import { getSupabaseSession } from "../supabase/auth/authService";
import {
  saveProject,
  fetchProjectById,
  fetchProjectComponents,
} from "../supabase/data/projectService";
import type { ComponentData, EditorState } from "../types/editor";
import { initializeCollaborationDoc } from "./CollaborationDoc";

type CollaborationContextType = ReturnType<typeof useCollaborationLogic>;
const CollaborationContext = createContext<CollaborationContextType | null>(
  null,
);

type UseCollaborationProps = {
  children?: React.ReactNode;
  setState: React.Dispatch<React.SetStateAction<EditorState>>;
  state: EditorState;
};

function useCollaborationLogic({
  setState,
  children,
  state,
}: UseCollaborationProps) {
  const currentUser = state.currentUser;
  const clientIdRef = useRef<string | null>(null);
  const userColorRef = useRef<string | null>(null);
  const cursorPosRef = useRef({ x: 0, y: 0 });

  const initCollaborationDoc = useRef(
    initializeCollaborationDoc(setState),
  ).current;

  const {
    getOrInitDoc,
    replaceComponents,
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    reorderComponent,
    clearCanvas,
  } = initCollaborationDoc;

  const [remoteCursors, setRemoteCursors] = useState<
    Map<string, { clientId: string; user: any; x: number; y: number }>
  >(new Map());

  const ablyKey = import.meta.env.VITE_ABLY_KEY as string | undefined;

  // ─── MODULE 2: collabTransport.ts ────────────────────────────────────────
  // EXTRACT: Binary codecs for Yjs updates over Ably
  const encodeUpdate = (update: Uint8Array) =>
    btoa(String.fromCharCode(...Array.from(update)));

  const decodeUpdate = (data: string) =>
    Uint8Array.from(atob(data), (char) => char.charCodeAt(0));
  // ─────────────────────────────────────────────────────────────────────────

  // ─── MODULE 1: collabDoc.ts ──────────────────────────────────────────────
  // EXTRACT: Yjs document initialization + component replacement
  // ─────────────────────────────────────────────────────────────────────────

  // ─── MODULE 3: useCollaboration.ts (KEEP HERE) ───────────────────────────
  // React effect: Yjs → React state bridge
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
  }, [setState]);

  // ─── MODULE 3: useCollaboration.ts (KEEP HERE) ───────────────────────────
  // React effect: Awareness identity bootstrap
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

  // ─── MODULE 3: useCollaboration.ts (KEEP HERE) ───────────────────────────
  // Cursor publish + awareness → UI cursor mapping
  const handleCanvasMouseMove = (e: MouseEvent) => {
    const { awareness } = getOrInitDoc();
    awareness.setLocalStateField("cursor", {
      x: e.clientX,
      y: e.clientY,
    });
  };

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
    // ─── MODULE 3: useCollaboration.ts (KEEP HERE) ───────────────────────────
    // React effect: Project hydration from DB
  }, []);

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
    // ─── MODULE 2: collabTransport.ts ────────────────────────────────────────
    // EXTRACT: Ably realtime transport (channel subscribe/publish lifecycle)
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
      }, 30);
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
      }, 20);
    };

    const handleRemoteAwareness = (message: { data: string }) => {
      if (!message?.data) return;
      const update = decodeUpdate(String(message.data));
      applyAwarenessUpdate(awareness, update, "remote");
    };

    ydoc.on("update", handleDocUpdate);
    awareness.on("update", handleAwarenessUpdate);

    channel.subscribe("yjs-update", handleRemoteUpdate as any);
    channel.subscribe("yjs-sync", handleRemoteUpdate as any);
    channel.subscribe("yjs-request-sync", handleSyncRequest as any);
    channel.subscribe("yjs-awareness", handleRemoteAwareness as any);

    channel.publish("yjs-request-sync", { clientId: clientIdRef.current });

    return () => {
      if (updateTimeout) clearTimeout(updateTimeout);
      if (awarenessTimeout) clearTimeout(awarenessTimeout);
      channel.unsubscribe("yjs-update", handleRemoteUpdate as any);
      channel.unsubscribe("yjs-sync", handleRemoteUpdate as any);
      channel.unsubscribe("yjs-request-sync", handleSyncRequest as any);
      channel.unsubscribe("yjs-awareness", handleRemoteAwareness as any);
      ydoc.off("update", handleDocUpdate);
      awareness.off("update", handleAwarenessUpdate);
      // ─────────────────────────────────────────────────────────────────────────

      // ─── MODULE 3: useCollaboration.ts (KEEP HERE) ───────────────────────────
      // React effect: Auto-save to Supabase      channel.detach();
      client.close();
    };
  }, [ablyKey, state.currentProjectId, state.currentView]);

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
    // ─────────────────────────────────────────────────────────────────────────

    // ─── MODULE 1: collabDoc.ts ──────────────────────────────────────────────
    // EXTRACT: Component mutation operations (add/update/delete/reorder/clear)    state.hasUnsavedChanges,
    state.currentView,
    state.currentProjectId,
    state.projectName,
  ]);
  // ─────────────────────────────────────────────────────────────────────────

  return {
    children,
    getOrInitDoc,
    replaceComponents,
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent,
    reorderComponent,
    clearCanvas,
    remoteCursors,
  };
}

export function CollaborationServiceProvider({
  children,
  setState,
  state,
}: UseCollaborationProps & { children: React.ReactNode }) {
  const Collaboration = useCollaborationLogic({
    setState,
    state,
  });
  return (
    <CollaborationContext.Provider value={Collaboration}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function CollaborationServiceContext() {
  const context = useContext(CollaborationContext);
  if (!context)
    throw new Error(
      "CollaborationServiceContext must be used within a CollaborationServiceProvider",
    );
  return context;
}

export default useCollaborationLogic;
