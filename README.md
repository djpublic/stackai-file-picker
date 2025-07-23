# Stack AI - Take-at-Home Task - Frontend Engineer (KB)

## Participant:

- Djalma Araújo (@djalmaaraujo)
- Email: djalma.araujo@gmail.com

## How to run the project

```
git clone git@github.com:djalmaaraujo/stackai-file-picker.git
cd stackai-file-picker
npm install
cp .env.example .env # Replace with real values
npm run dev

Open http://localhost:3000 # You should be redirected to /688e4996-da83-45ee-8ed5-a8c8daaf0308
```

## ⚒️ **Tech Stack**

- **Framework**: React + Next.js (latest stable version)
- **Data Fetching**: Tanstack Query + fetch
- **State Management**: Zustand
- **Styling**: Tailwind CSS (latest stable version)
- **Components library**: [Shadcn](https://ui.shadcn.com/)

##  UI/UX quality:

- Does everything work as expected? Are there any console errors or broken features?
  A: I believe what was requested is implemented. Console errors are empty. Broken features, should be ok.

- Is it fast? Do you have to wait for the UI? Does it make good use of optimistic updates? Do you rollback on errors?
  A: The API is slow for some operations, but it's using some UI/Skeleton techniques that helps with the user experience.

- Is it intuitive?
  A: I believe so.

- Does it look visually appealing?
  A: ¯\_(ツ)\_/¯

- Low Cumulative Layout Shift? Do things move around when clicking something (this is bad)?
  A: I tried to have little CLS, but with the time I had, I think the UX is good.

## 🔖 Deliverable:

1. **Source Code**: https://github.com/djalmaaraujo/stackai-file-picker
2. **Live Demo**: A link to a live demo of the page **hosted on Vercel.**
   1. **Demo video**: Sent over email (arosinol@stack-ai.com)
   2. **Website link**: [https://stackai.djalmaaraujo.com/](https://stackai.djalmaaraujo.com/)
3. **Documentation**: This file.

## Technical choices

The video has a good explanation of most features and decisions.

### File Picker vs. On-page component

I started the project building a very similar version to what Stack AI has in production, but I believe that took most of my time and I was spending too much time in a way to make the FilePicker re-usable as much as possible, but in the end, due to the need of requesting both Knowledge Basic and the Connection API, I tought it would be a better user experience to have just one.

The only downside with this approach is that it's not super clear to the user which files are included in the sub-folders. But I do think this is something could be improved in the future.

It's important while using the project that you are a User looking at a Knowledge Base with the Google Drive connection active for you. That's the whole context of the approach I took. I am not creating more Knowledge Bases, and I avoided hitting the Knowledge Bases list endpoint, because I tested online and it's really slow.

I stick with the `688e4996-da83-45ee-8ed5-a8c8daaf0308` Knowledge base as the context for the application.

### Stack

I followed the suggested stack from the project, including Zustand.

- Plus: I added JEST for tests
- Plug: I added Github Actions in the CI

### Bonus Features

I did not have time to implement the filters and sorting, but I added the search. I found the search endpoints by using the Stack API production app. There's no search API in the Jupyter file.

### Known Issues

- Checkboxes when selecting parent/children needs some improvements;
- Pagination: It's an improvement I could do;
- Tests: I didn't have much time to write the challenge, but I could show some testing strategies or talk about during a System design interview, or a live coding;
- Some inconsistency with some React Query invalidations: Because we always need two API's to sync the files indexed, I had some challenges to invalidate the queries;
- The API authentication method: I did not implement a cookie-based authentication, so for the purpose of this code challenge, all requests are making a new authentication in the BACKEND;

### Usage of Hooks

This project makes extensive use of custom React hooks to encapsulate logic for data fetching, mutations, and state management. Using hooks in this way keeps the codebase modular, readable, and easy to maintain. Each hook is focused on a single responsibility, which makes testing and reusing logic much simpler.

**Pros of the hook approach:**

- **Separation of concerns:** Each hook handles a specific piece of logic, keeping components clean and focused on UI.
- **Reusability:** Hooks can be reused across different components, reducing code duplication.
- **Consistency:** Data fetching, mutations, and side effects are handled in a consistent way throughout the app.

**Key hooks in this project:**

- `useFetchResources`: Fetches files and folders from either the knowledge base or the connection (e.g., Google Drive) for a given path. Handles loading and error states.
- `useDeleteKnowledgeBaseResource`: Handles the mutation to de-index (remove) a file or folder from the knowledge base, including error handling and UI feedback.
- `useKnowledgeBaseStore`: Manages global state related to the current knowledge base, such as the selected knowledge base and its properties.
- `useFileTreeStore`: Manages the state of the file tree, including selected files, expanded folders, syncing items, and search/filter state.
- `useProcessSync` (in `hooks/sync/use-process-sync.ts`): Orchestrates the multi-step process of syncing files to the knowledge base, including updating resources and triggering the sync process.
- `poolKbSyncPendingResources`: Utility hook/function to refresh or poll the state of pending resources being synced, ensuring the UI stays up-to-date.

Overall, the use of hooks in this project leads to a clean, maintainable, and scalable codebase. Each hook is well-scoped and documented, making it easy for new developers to understand and extend the functionality.

### The FileTree Components

The `components/file-tree` directory contains the main logic and UI for browsing, selecting, and managing files and folders from both the knowledge base and the connected source (e.g., Google Drive). The core challenge addressed here is to present a unified file tree that merges data from two different APIs:

- **Knowledge Base API**: Represents files and folders that have already been indexed (synced) into the application's knowledge base.
- **Connection API**: Represents the live file structure from the external source (such as Google Drive), including files and folders that may not yet be indexed.

#### How the APIs Interact

When rendering the file tree, the app needs to show both:

- Which files/folders exist in the external source (connection API).
- Which of those are already indexed in the knowledge base (knowledge base API).

To achieve this, the `FileTreeRow` component fetches data from both APIs for each folder level:

- It calls the knowledge base API to get the list of indexed resources for the current path.
- It calls the connection API to get the live list of files/folders for the same path.

The utility function `enhanceItems` then merges these two lists, marking which items are already indexed and which are not. This allows the UI to show, for example, which files are "synced" and which are only present in the external source.

#### FileTree Component Structure

- **FileTree**: The root component. It manages the overall table and selection state.
- **FileTreeRow**: Recursively renders each folder and its children. For each folder, it fetches and merges data from both APIs.
- **FileTreeItem**: Renders a single file or folder row, including actions like delete (de-index) and selection.
- **FileTreeItemDelete**: Handles the logic for de-indexing a file from the knowledge base, using a confirmation dialog and mutation hook.

#### Key Solution Points

- **Merging Data**: The main technical solution is to merge the two data sources at each folder level, so the UI can accurately reflect both the live file structure and the indexed state.
- **State Management**: Zustand is used to manage selection, expansion, and syncing state across the file tree.
- **Hooks**: Custom hooks encapsulate the logic for fetching, mutating, and syncing data, keeping components clean and focused.

#### Recommendations for Improvement

- **Pagination and Performance**: Add pagination or lazy loading for folders with many files to improve performance and usability.
- **Sorting and Filtering**: Implement more advanced sorting and filtering options in the file tree UI.

### UI Decisions

TBD

### API Routes

I decided to hit the API fully from the backend. I tried to follw as much as I could the REST approach, but some APIs are not following exactly REST. They are all located in `/app/api`.

#### API Routes in `/app/api`

Below are the main API routes used in this project, described in a human-friendly way:

- **Knowledge Base Resources**

  - `GET /api/knowledge-bases/{knowledgeBaseId}/resources?resource_path=...`
    - Fetches resources (files/folders) for a given knowledge base at a specific path.
  - `PUT /api/knowledge-bases/{knowledgeBaseId}`
    - Updates the knowledge base with new resource IDs (used for syncing files).
  - `GET /api/knowledge_bases/sync/trigger/{knowledgeBaseId}`
    - Triggers the sync process for a knowledge base.

- **Connection Resources**

  - `GET /api/connections/{connectionId}?resource_id=...&search=...`
    - Fetches resources (files/folders) from a connected source (e.g., Google Drive) at a specific path, with optional search.

- **Resource Deletion**

  - `DELETE /api/knowledge-bases/{knowledgeBaseId}/resources`
    - De-indexes (removes) a file or folder from the knowledge base (does not delete from Google Drive).

- **Other**
  - There may be additional endpoints for authentication, user info, or other features, but the above are the core file and sync-related routes.

**Note:**

- All routes are RESTful and return JSON.
- Most routes require a valid `knowledgeBaseId` or `connectionId`.
- The sync process is multi-step and involves both updating and triggering sync on the knowledge base.

If you need more details on a specific route, check the corresponding handler in `/app/api`.

### The Sync files Process

By learning from the Stack AI production app, I realized that the way the project index files into the database is very unusual. I created a big hook (hooks/sync/use-process-sync.ts) that executes the sync in different steps, and at the end invalidate the queries.

This is how the sync process works:

1. Show a toast notification to inform the user that sync is starting.
2. Optimistically update the UI to reflect that selected items are being indexed.
3. Collapse all expanded file paths to reload the root directory (like Stack AI app behavior).
4. Send a PUT request to /knowledge-base/{id} to update the knowledge base with the selected resource IDs.
5. Trigger the sync process by calling GET /knowledge_bases/sync/trigger/{id}.
6. Invalidate queries so the UI can refetch

## Overall Comment

I had some hard time to focus and do everything I wanted for this project. I do think I am a great fit for the Stack the team is working on, and I can show more of my work if you need extra meetings, system design meetings, etc.

The codebase is organized, and it's spread into smaller components, but like I said in the known-issues, there are room for improvement, as everything in life :).
