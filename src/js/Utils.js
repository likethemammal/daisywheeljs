module.exports =  {
    //Taken from http://stackoverflow.com/questions/1865563/set-cursor-at-a-length-of-14-onfocus-of-a-textbox/1867393#1867393 on 8/8/14
    setCursor: function(node,pos){

        var node = (typeof node == "string" || node instanceof String) ? document.getElementById(node) : node;

        if(!node){
            return false;
        }else if(node.createTextRange){
            pos += ''; //IE breaks if pos isnt a string.
            var textRange = node.createTextRange();
            textRange.collapse(true);
            textRange.moveEnd(pos);
            textRange.moveStart(pos);
            textRange.select();
            return true;
        }else if(node.setSelectionRange){
            node.setSelectionRange(pos,pos);
            return true;
        }

        return false;
    },

    //Taken from http://stackoverflow.com/questions/263743/caret-position-in-textarea-in-characters-from-the-start on 8/8/14
    getCursor: function(el) {
        if (el.selectionStart) {
            return el.selectionStart;
        } else if (document.selection) {
            el.focus();

            var r = document.selection.createRange();
            if (r == null) {
                return 0;
            }

            var re = el.createTextRange(),
                rc = re.duplicate();
            re.moveToBookmark(r.getBookmark());
            rc.setEndPoint('EndToStart', re);

            return rc.text.length;
        }
        return 0;
    }
};