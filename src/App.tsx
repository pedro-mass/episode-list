import React from "react";
import _ from "lodash";

export default function App() {
  return <Config />;
}

function Config() {
  return (
    <div>
      <h1>Episode List</h1>

      <section>
        <h2>Folder to Monitor</h2>
        <FolderPicker />
      </section>

      <section>
        <h2>Enable Folders</h2>
        {/* <BookmarksPicker bookmarks={bookmarks} /> */}
      </section>
    </div>
  );
}

function FolderPicker() {
  const [state, setState] = React.useState<{
    status: "initial" | "ready";
    folders: chrome.bookmarks.BookmarkTreeNode[];
    selectedFolderId?: string | null;
  }>({
    status: "initial",
    folders: [],
    selectedFolderId: null,
  });
  const setSelectedFolderId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState((oldState) => ({
      ...oldState,
      selectedFolderId: e.target.value,
    }));
  };

  React.useEffect(function getFolders() {
    async function get() {
      const folders =
        (await getBookmarkBarContainer())?.children?.filter(isFolder) ?? [];

      setState((oldState) => ({
        ...oldState,
        status: "ready",
        folders,
      }));
    }
    get();
  }, []);

  React.useEffect(
    function updateFolderSelection() {
      const bookmarks =
        state.folders
          ?.find((x) => x.id === state.selectedFolderId)
          ?.children?.filter(_.negate(isFolder)) ?? [];

      // pedro: shift state up a level so that the BookmarkPicker can access these bookmarks
      console.log({
        fn: "updateFolderSelection",
        bookmarks,
        state,
      });
    },
    [state.selectedFolderId]
  );

  // console.log({ fn: "FolderPicker", state });

  if (state.status !== "ready") return <p>Loading...</p>;

  return (
    <select
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
