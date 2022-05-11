(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof module==='object'&&module.exports){module.exports=factory(require('jquery'));}else{factory(window.jQuery);}}(function($){$.extend(true,$.summernote.lang,{'en-US':{math:{dialogTitle:'Insert Math',tooltip:'Insert Math',pluginTitle:'Insert math',ok:'Insert',cancel:'Cancel'}}});$.extend($.summernote.options,{math:{icon:'<b>&sum;</b>'}});$.extend($.summernote.plugins,{'math':function(context){var self=this;var ui=$.summernote.ui;var $editor=context.layoutInfo.editor;var options=context.options;var lang=options.langInfo;self.events={'summernote.keyup summernote.mouseup summernote.change summernote.scroll':()=>{self.update();},'summernote.disable summernote.dialog.shown':()=>{self.hide();},};context.memo('button.math',function(){let button=ui.button({contents:options.math.icon,tooltip:lang.math.tooltip,click:function(e){context.invoke('editor.saveRange');context.invoke('math.show');}});return button.render();});self.initialize=function(){let $container=options.dialogsInBody?$(document.body):$editor;let body=`<div class="form-group"><p>Type <a href="https://khan.github.io/KaTeX/function-support.html" target=_blank">LaTeX markup</a> here: </p><p><input id="note-latex" class="form-control"></p><p>Preview: </p><div style="min-height:20px;"><span class="note-math-dialog"></span></div><script> var  $mathElement = $('.note-math-dialog');var  mathSpan = $mathElement[0];var  latexSpan = document.getElementById('note-latex');latexSpan.addEventListener('keyup', renderMath);function renderMath(){var  oldMath = mathSpan.innerHTML;
try {katex.render(this.value, mathSpan);}catch(e) { mathSpan.innerHTML = oldMath;}}</script></div>`;self.$dialog=ui.dialog({title:lang.math.dialogTitle,body:body,footer:'<button class="btn btn-primary note-math-btn">'+lang.math.ok+'</button>'}).render().appendTo($container);};self.hasMath=function(node){return node&&$(node).hasClass('note-math');};self.isOnMath=function(range){const ancestor=$.summernote.dom.ancestor(range.sc,self.hasMath);return!!ancestor&&(ancestor===$.summernote.dom.ancestor(range.ec,self.hasMath));};self.update=function(){if(!context.invoke('editor.hasFocus')){self.hide();return;}
const rng=context.invoke('editor.getLastRange');if(rng.isCollapsed()&&self.isOnMath(rng)){const node=$.summernote.dom.ancestor(rng.sc,self.hasMath);const latex=$(node).find('.katex');if(latex.text().length!==0){}else{self.hide();}}else{self.hide();}}
self.hide=function(){}
self.destroy=function(){ui.hideDialog(this.$dialog);self.$dialog.remove();};self.bindEnterKey=function($input,$btn){$input.on('keypress',function(event){if(event.keyCode===13)$btn.trigger('click');});};self.bindLabels=function(){self.$dialog.find('.form-control:first').focus().select();self.$dialog.find('label').on('click',function(){$(this).parent().find('.form-control:first').focus();});};self.show=function(){let $mathSpan=self.$dialog.find('.note-math-dialog');let $latexSpan=self.$dialog.find('#note-latex');let $selectedMathNode=self.getSelectedMath();if($selectedMathNode===null){$mathSpan.empty();$latexSpan.val('');}
else{let hiddenLatex=$selectedMathNode.find('.note-latex').text();$latexSpan.val(hiddenLatex);katex.render(hiddenLatex,$mathSpan[0]);}
let mathInfo={};self.showMathDialog(mathInfo).then(function(mathInfo){ui.hideDialog(self.$dialog);let $mathNodeClone=$mathSpan.clone();let $latexNode=$('<span>');$latexNode.addClass('note-latex').css('display','none').text($latexSpan.val()).appendTo($mathNodeClone);$mathNodeClone.removeClass('note-math-dialog').addClass('note-math');if($selectedMathNode===null){addListener($mathNodeClone[0],'click',function(){context.invoke('editor.saveRange');context.invoke('math.show');});}
context.invoke('editor.restoreRange');context.invoke('editor.focus');if($selectedMathNode===null)
context.invoke('editor.insertNode',$mathNodeClone[0]);else{if($.trim($latexNode.html())==''){$selectedMathNode.remove()}
else{$selectedMathNode.html($mathNodeClone.html());}}
context.invoke('triggerEvent','change');});};self.showMathDialog=function(editorInfo){return $.Deferred(function(deferred){let $editBtn=self.$dialog.find('.note-math-btn');ui.onDialogShown(self.$dialog,function(){context.triggerEvent('dialog.shown');$editBtn.click(function(e){e.preventDefault();deferred.resolve({});});self.bindEnterKey($editBtn);self.bindLabels();});ui.onDialogHidden(self.$dialog,function(){$editBtn.off('click');if(deferred.state()==='pending')deferred.reject();});ui.showDialog(self.$dialog);});};self.getSelectedMath=function(){let selection=window.getSelection();if(selection){let $selectedMathNode=null;let $mathNodes=$('.note-math');$mathNodes.each(function(){if(selection.containsNode(this,true)){$selectedMathNode=$(this);}});return $selectedMathNode;}};}});}));