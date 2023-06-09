import React from "react";
import _ from "lodash";

export default function App() {
  return (
    <div className="w-44">
      <Config />
    </div>
  );
}

function Config() {
  return (
    <div>
      <header className="mb-2 border-b-2 border-b-black border-opacity-30 text-center">
        <h1 className="text-2xl font-bold">Episode List</h1>
      </header>

      <section className="text-center">
        <h2 className="text-lg">Folder to Monitor</h2>
        <FolderPicker />
      </section>
    </div>
  );
}

function FolderPicker() {
  const [state, setState] = React.useState<{
    statuses: {
      foldersLoaded?: boolean;
      folderIdLoaded?: boolean;
    };
    folders: chrome.bookmarks.BookmarkTreeNode[];
    selectedFolderId?: string | null;
  }>({
    statuses: {
      foldersLoaded: false,
      folderIdLoaded: false,
    },
    folders: [],
    selectedFolderId: null,
  });
  const setSelectedFolderId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFolderId = e.target.value;
    setState((oldState) => ({
      ...oldState,
      selectedFolderId,
    }));
    saveFolderId(selectedFolderId);
  };

  React.useEffect(function getFolders() {
    async function get() {
      const folders =
        (await getBookmarkBarContainer())?.children?.filter(isFolder) ?? [];

      setState((oldState) => ({
        ...oldState,
        statuses: {
          ...oldState.statuses,
          foldersLoaded: true,
        },
        folders,
      }));
    }
    get();
  }, []);

  React.useEffect(function retrieveSavedFolderId() {
    getSavedFolderId()
      .then((selectedFolderId) => {
        setState((oldState) => ({
          ...oldState,
          selectedFolderId: String(selectedFolderId),
        }));
      })
      .finally(() =>
        setState((oldState) => ({
          ...oldState,
          statuses: {
            ...oldState.statuses,
            folderIdLoaded: true,
          },
        }))
      );
  }, []);

  const isReady = _.values(state.statuses).every((x) => x);
  if (!isReady) return <p>Loading...</p>;

  return (
    <select
      className="w-full p-2"
      disabled={!state.selectedFolderId}
      onChange={setSelectedFolderId}
      value={state.selectedFolderId ?? undefined}
    >
      <option value="undefined">Select Folder</option>
      {state.folders.map((x) => (
        <option key={x.id} value={x.id}>
          {x.title}
        </option>
      ))}
    </select>
  );
}

async function getSavedFolderId() {
  return chrome.storage.local.get({ folderId: "" }).then((x) => x.folderId);
}

async function saveFolderId(folderId: string | null | undefined = null) {
  return chrome.storage.local.set({ folderId });
}

async function getBookmarkContainers() {
  return chrome.bookmarks.getTree();
}

async function getBookmarkBarContainer() {
  return (await getBookmarkContainers())?.[0]?.children?.find((x) =>
    /bookmarks bar/i.test(x.title)
  );
}

function isFolder(bookmark: {
  children?: chrome.bookmarks.BookmarkTreeNode[];
}) {
  return !_.isNil(bookmark?.children);
}
