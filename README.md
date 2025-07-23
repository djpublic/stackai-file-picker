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

### Bonus Features

I did not have time to implement the filters and sorting, but I added the search. I found the search endpoints by using the Stack API production app. There's no search API in the Jupyter file.

### Known Issues

- Checkboxes when selecting parent/children needs some improvements;
- Pagination: It's an improvement I could do;
- Tests: I didn't have much time to write the challenge, but I could show some testing strategies or talk about during a System design interview, or a live coding;
- Some inconsistency with some React Query invalidations: Because we always need two API's to sync the files indexed, I had some challenges to invalidate the queries;

### Usage of Hooks

TBD

### The FileTree Components

TBD

### UI Decisions

TBD

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
