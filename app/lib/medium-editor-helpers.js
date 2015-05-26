import Ember from 'ember';

function ensureEditorHasSelection(editorInstance) {
  var editorSelection = editorInstance.exportSelection();
  if (Ember.isEmpty(editorSelection)) {
    _selectLastCharacterInEditorInstance(editorInstance);
  }
}

function _selectLastCharacterInEditorInstance(editorInstance) {
  var editorContentLength = _getEditorContentLength(editorInstance);
  editorInstance.importSelection({ start: editorContentLength, end: editorContentLength });
}

function _getEditorContentLength(editorInstance) {
  editorInstance.selectAllContents();
  var editorSelection = editorInstance.exportSelection();

  if (Ember.isEmpty(editorSelection)) {
    var rootEditorElement = editorInstance.elements[0];
    editorInstance.selectElement(rootEditorElement);
    editorSelection = editorInstance.exportSelection();
  }

  return editorSelection.end;
}

export {
  ensureEditorHasSelection
};