# Hackathon Agent

> Plataforma B2B de gestión de inventario con agentes de inteligencia artificial (arquitectura multiagente).

Este repo contiene la interfaz front-end (Vite + React + TypeScript) de un dashboard pensado para mostrar cómo los usuarios pueden visualizar y gestionar múltiples agentes IA y administrar su inventario con ayuda de estos agentes.

🎯 Objetivo final

- Mostrar de forma clara y atractiva cómo los usuarios visualizan y gestionan múltiples agentes IA.
- Permitir interacciones conversacionales con los agentes desde el propio dashboard (chat por agente).
- Administrar productos del inventario con soporte de IA (búsqueda, alertas, actualizaciones).

Contenido del proyecto

- `src/` — aplicación React/TypeScript.
- `src/components/` — componentes UI y vistas (Sidebar, Topbar, AgentsView, ChatPanel, InventoryView, etc.).
- `src/components/ui/` — biblioteca UI (componentes reusables, wrappers de Radix, utilidades).

Requisitos

- Node.js: Se recomienda Node 22.x (o >= 20.19). Usa nvm/fnm/asdf para gestionar versiones localmente.
- pnpm (el proyecto contiene `pnpm-lock.yaml`, por lo que recomendamos usar pnpm): https://pnpm.io/

Instalación

1. Instala la versión recomendada de Node (ejemplo con nvm):

```bash
nvm install 22
nvm use 22
```

2. Instala dependencias:

```bash
pnpm install
```

3. Arrancar en modo desarrollo:

```bash
pnpm run dev
```

4. Compilar para producción:

```bash
pnpm run build
```

Arquitectura y flujo

- Frontend (Vite + React + TypeScript)
  - Componentes principales:
    - Sidebar: navegación entre vistas (Overview, Agents, Inventory, History, Settings).
    - AgentsView: lista de agentes, métricas y tarjetas de agente (abrir chat / ver estado).
    - ChatPanel: chat conversacional por agente.
    - InventoryView: gestión de productos, búsquedas y acciones asistidas por IA.
  - UI primitives: wrappers de Radix UI y utilidades (clsx, tailwind-merge, cva).

- Integración IA
  - Los componentes de UI están preparados para invocar servicios IA (backend). La integración real (llamadas a APIs, websocket, auth) queda en el backend y adaptadores.

Cómo probar las interacciones IA (modo demo)

1. Levanta el front con `pnpm run dev`.
2. En `AgentsView` abre un agente y pulsa "Ver chat".
3. El `ChatPanel` está preparado para conectar con un endpoint de mensajería — usa mocks o conecta con tu backend para ver mensajes.
