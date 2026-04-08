// In its own file to avoid circular dependencies
export const FILE_EDIT_TOOL_NAME = 'Edit'

// Permission pattern for granting session-level access to the project's .maya/ folder
export const MAYA_FOLDER_PERMISSION_PATTERN = '/.maya/**'

// Permission pattern for granting session-level access to the global ~/.maya/ folder
export const GLOBAL_MAYA_FOLDER_PERMISSION_PATTERN = '~/.maya/**'

export const FILE_UNEXPECTEDLY_MODIFIED_ERROR =
  'File has been unexpectedly modified. Read it again before attempting to write it.'
