# Episode List (EL)

**Pitch:**
Make updating bookmarks used for watching episodes across the web.
Use bookmarks, and smart prompting, to create your own Episode List/Queue.

## dev

### loose workflow

- Mark folder as Episode List
- Existing bookmarks will be the latest link to whichever show you're watching
- ExtensionList (aka EL) will detect when there is a very similar link and prompt you to see if you want to update your currently stored link
- If YES, EL will update the stored bookmark

### questions
- should we track multiple folders?
  - would complicate the UI a tad, but maybe it'll change from a select list, to a multi-select list.
  - probably make things slower too?
- can non-trackable links exist in the folder?
  - can probably label the bookmark with metadata

### resources
- build config
  - https://crxjs.dev/vite-plugin/getting-started/react/create-project
- extensions
  - https://developer.chrome.com/docs/extensions/
  - permissions: https://developer.chrome.com/docs/extensions/mv3/declare_permissions/
  - bookmarks
    - https://developer.chrome.com/docs/extensions/reference/bookmarks/
- css
  - tailwind
    - https://nerdcave.com/tailwind-cheat-sheet

### phases

- [ ] list bookmarks
- [ ] select bookmark folder(s)
- [ ] figure out something to do the matching
- [ ] popup for when there is a match
- [ ] popup allows you to update the bookmark