//1.左侧菜单区域
	function createTreeMenu(datas, id ){
		var html = "";
		var ch = handle.findChildsById(datas, id);
		if(ch){
			html += "<ul><li>";
			ch.forEach(function(val){
				var level = handle.findParentsById(datas, val.id).length;
				var children = handle.findChildsById(datas, val.id);//获取孩子,如果有子节点，文件可以打开
				var classname = children.length ? "tree-contro-none":"tree-contro";
				html += '<h2 data-id='+val.id+' style="padding-left:'+20*level+'px;"class="tree '+classname+'"><i class="i"></i><span class="ico"></span><span>'+val.title+'</span></h2>';
				html += createTreeMenu(datas, val.id );
			});
			html += "</li></ul>";
		}
		return html;	
	}
	
//2.右侧导航区域
	function createNavHtml(datas, id){
		var parent = handle.findParentsById(datas, id).reverse();
		var html = "";
		parent.forEach(function(val, ind){
			if(ind == 0){
				html += '<strong data-id="'+val.id+'">'+val.title+'</strong>';
			}else{
				html += '<span></span><strong data-id="'+val.id+'">'+val.title+'</strong>';
			}
		});

		return html;
	}
	
//3、生成文件区域
	function createFileHtml(datas , id){
		var child = handle.findChildsById(datas, id);
		var html = "";
		child.forEach(function( val ){//超级字符串
			html += `<div class="files" data-id="${val.id}">${fileHtmlFn(val)}</div>`;
		});
		return html;
	}
	
//文件域
function fileHtmlFn(val){
	var str = `	<img class="lug" src="img/lug.png"/>
				<input class="inp" type="text" value="" />
				<p class="inpt">${val.title}</p>
				<div class="brbcheck"></div>`;
	return str;
}
function createFile(){
	var oDiv = document.createElement("div");
	oDiv.className = "files";
	oDiv.innerHTML = fileHtmlFn({});
	return oDiv;
}
