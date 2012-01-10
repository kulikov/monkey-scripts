/*
 * Menu: Kulikov > Format Indent
 * Key: M4+1
 * DOM: http://download.eclipse.org/technology/dash/update/org.eclipse.eclipsemonkey.lang.javascript
 * 
 * Before:
 * v = 'value';
 * var1 = 'value2';
 * outputValue = 'any text';
 * 
 * After:
 * v           = 'value';
 * var1        = 'value2';
 * outputValue = 'any text';
 * 
 * @include "/EclipseMonkey/scripts/monkey-doc.js"
 */
function main() 
{
	var editor   = editors.activeEditor,
		start_ix = editor.getOffsetAtLine(editor.getLineAtOffset(editor.selectionRange.startingOffset)),
		end_ix   = editor.getOffsetAtLine(editor.getLineAtOffset(editor.selectionRange.endingOffset) + 1),
        text     = editor.source.substring(start_ix, end_ix),
        maxLen   = 0,
        output   = [];
        
    var lines = text.split(/\r\n|\n|\r/);
    for (var i = 0; i < lines.length; i++) {
        
        lines[i] = lines[i]
            .replace(/(while|if|foreach|try|\))([\(\{])/g, '$1 $2')
            //.replace(/\( \$/g, '($')
            //.replace(/\) \)/g, '))')
            .replace(/([^\s]+)\s*\-\>\s*/g, '$1->')
            .replace(/([^\s]{1})=>/g, '$1 =>')
            .replace(/=>([^\s]{1})/g, '=> $1')
            .replace(/\,([\$\'\"\w])/g, ', $1')
            .replace(/\(\s+\)/g, '()');
        
        re = lines[i].match(/^([^=]+)(=.+)$/);
        if (re) {
            re[1]  = re[1].replace(/\s+$/, '');
            re[0]  = re[1].replace(/^\s+/, '');
            
            if (re[1].substr(-1) === '+') {
                re[1]  = re[1].substr(0, re[1].length - 1);
                re[2]  = '+' + re[2];
            }
            
            maxLen = Math.max(re[0].length, maxLen);
        } else {
            re = lines[i];
        }
        
        output.push(re);
    }
    
    lines = [];
    for (var i = 0; i < output.length; i++) {
        if (typeof output[i] != 'string') {
            lines.push(output[i][1] + (new Array(maxLen + 2 - output[i][0].length).join(' ')) + output[i][2]);
        } else {
            lines.push(output[i]);
        }
    }
    
    editor.applyEdit(start_ix, text.length, lines.join("\n"));
}