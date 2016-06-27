import FileSerializer from './file';

export default FileSerializer.extend({

  normalizeResponse(store, modelClass, payload) {
    return {
      data: payload.entries.map((entry) => {
        let isFolder = entry['.tag'] === 'folder';
        let filetype = isFolder ? 'folder' : '';

        if (!filetype && entry.name.indexOf('.') > -1) {
          filetype = entry.name.split('.').pop();
        }

        let ret = {
          id: entry.id,
          type: 'file',
          attributes: {
            name: entry.name,
            path: entry.path_display,
            modified: entry.client_modified,
            size: entry.size,
            filetype,
            isFolder
          }
        };

        if (entry.parent) {
          ret.relationships = {
            parent: {
              data: {
                type: 'file',
                id: entry.parent
              }
            }
          };
        }

        return ret;
      })
    };
  }
});
