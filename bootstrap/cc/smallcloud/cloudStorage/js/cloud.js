var cont_left=document.getElementsByClassName("cont_left")[0];
var contents=document.querySelector(".content");
var popup=document.getElementById("popup");
function resize(){
	var clientH = t.view().h;
	contents.style.height = clientH - 130 + "px"; 
}
resize();
window.onresize = resize;
var datas=data.files;

//通过id生成list的内容。
function listStr(id){
	var childs=fnAll.getChilds(datas,id);
	if(childs.length==0){
		return '';
	}
	var str="<ul>";
	childs.forEach(function(a){
		var parentsLength=fnAll.getParents(datas,a.id).length;
		var childs2=fnAll.getChilds(datas,a.id);
		var className = childs2.length ? "yes active" : "no";
		str+="<li><h2 style='padding-left:"+20*parentsLength+"px' data-id='"+a.id+"'><span class='"+className+"'></span><em class='active'></em>"+a.title+"</h2>";
		str+=listStr(a.id);
		str+="</li>";
	})
	str+="</ul>";
	return str;
}
cont_left.innerHTML=listStr(-1);//初始化

var nav=document.getElementsByClassName("navHtml")[0];
//通过id生成nav
function navStr(id){
	var str="";
	fnAll.getParents(datas,id).reverse().forEach(function(a){
		str+="<em>></em><span data-id='"+a.id+"'>"+a.title+"</span>"
	})
	return str;
}
nav.innerHTML=navStr(0);//初始化

//通过id生成file区
var files=document.getElementsByClassName("file-list")[0];
function fileStr(id){
	var str="";
	if(!fnAll.getChilds(datas,id).length){
		str="<div class='no'></div>";
	}else{
		str="<div class='yes'></div>";
	}
	fnAll.getChilds(datas,id).forEach(function(a){
		str+="<li data-id='"+a.id+"'><em></em><span>"+a.title+"</span><input type='text' /></li>";
	})
	return str;
}
files.innerHTML=fileStr(0);//初始化

//通过id确认哪个h2。
var Luls=cont_left.getElementsByTagName("ul");
var h2s=cont_left.getElementsByTagName("h2");
var Lspans=cont_left.getElementsByTagName("span");
var Lems=cont_left.getElementsByTagName("em");
function positionH2(id){
	for (var i = 0; i < h2s.length; i++) {
		var h2Id=h2s[i].dataset.id;
		if(h2Id==id){
			return h2s[i];
		}
	}
}


//重复渲染页面
function xuanran(nowId){
	positionH2(last).style.background="";
	positionH2(nowId).style.background="#e1e8ee";
	last=nowId;
	nav.innerHTML=navStr(nowId);
	nav.lastElementChild.className="active";
	files.innerHTML=fileStr(nowId);
	t.removeClass(checkall,"checked");
}

//点击左侧list。
var last=0;
//Luls[0].style.display="block";
t.on(cont_left,"click",function(e){
	var target=e.target;
	if(target=t.parent(target,"h2")){
		var nowId=target.dataset.id;
		xuanran(nowId)
		if(!target.nextElementSibling){
			var uls = target.parentNode.parentNode.getElementsByTagName("ul");
			var spans=target.parentNode.parentNode.getElementsByTagName("span");
			var ems=target.parentNode.parentNode.getElementsByTagName("em");
			for (var j = 0; j < spans.length; j++) {
				t.removeClass(spans[j],"active");
				ems[j].className="";
			}
			for (var i = 0; i < uls.length; i++) {
				uls[i].style.display = "none";
				uls[i].previousElementSibling.onoff = true;
			}
			return ;
		}
		if(!target.onoff){//
			//如果h2下面的ul是打开的,那合上它
			//然后把点击的h2内部所有的ul全部关上
			target.nextElementSibling.style.display = "none";
			t.removeClass(target.children[0],"active");
			target.children[1].className="";
			target.onoff = true;
			var uls = target.nextElementSibling.getElementsByTagName("ul");
			var spans=target.nextElementSibling.getElementsByTagName("span");
			var ems=target.nextElementSibling.getElementsByTagName("em");
			for (var j = 0; j < spans.length; j++) {
				t.removeClass(spans[j],"active");
				ems[j].className="";
			}
			for (var i = 0; i < uls.length; i++) {
				uls[i].style.display = "none";
				uls[i].previousElementSibling.onoff = true;
			}
		}else{
			//h2下面的ul是关闭的
//			    			把同级的h2里面的ul全部关上
//							然后把点击的h2下面的ul打开
			var uls = target.parentNode.parentNode.getElementsByTagName("ul");
			var spans=target.parentNode.parentNode.getElementsByTagName("span");
			var ems=target.parentNode.parentNode.getElementsByTagName("em");
			for (var j = 0; j < spans.length; j++) {
				t.removeClass(spans[j],"active");
				ems[j].className="";
			}
			for (var i = 0; i < uls.length; i++) {
				uls[i].style.display = "none";
				uls[i].previousElementSibling.onoff = true;
			}
			target.nextElementSibling.style.display = "block";
			t.addClass(target.children[0],"active")
			target.children[1].className="active";
			target.onoff = false;
		}
	}
})

//点击nav区域
t.on(nav,"click",function(e){
	var span=e.target;
	if(span.nodeName.toLowerCase()==="span"){
		var nowId=span.dataset.id;
		var uls = positionH2(nowId).parentNode.parentNode.getElementsByTagName("ul");
		var spans=positionH2(nowId).parentNode.parentNode.getElementsByTagName("span");
		var ems=positionH2(nowId).parentNode.parentNode.getElementsByTagName("em");
		for (var j = 0; j < spans.length; j++) {
			t.removeClass(spans[j],"active");
			ems[j].className="";
		}
		for (var i = 0; i < uls.length; i++) {
			uls[i].style.display = "none";
			uls[i].previousElementSibling.onoff = false;
		}
		positionH2(nowId).nextElementSibling.style.display = "block";
		positionH2(nowId).style.background="active";
		t.addClass(positionH2(nowId).children[0],"active");
		positionH2(nowId).children[1].className="active";
		positionH2(nowId).onoff = true;
		xuanran(nowId)
	}
})

//点击文件区域,进入文件
t.on(files,"click",function(e){
	var target=e.target;
	if(target.nodeName=="EM"||target.nodeName=="INPUT"){
		return;
	}
	if(target = t.parent(target,"li")){
		var nowId = target.dataset.id;
		var uls = positionH2(nowId).parentNode.parentNode.getElementsByTagName("ul");
		var spans=positionH2(nowId).parentNode.parentNode.getElementsByTagName("span");
		var ems=positionH2(nowId).parentNode.parentNode.getElementsByTagName("em");
		for (var j = 0; j < spans.length; j++) {
			t.removeClass(spans[j],"active");
			ems[j].className="";
		}
		for (var i = 0; i < uls.length; i++) {
			uls[i].style.display = "none";
			uls[i].previousElementSibling.onoff = false;
		}
		positionH2(nowId).parentNode.parentNode.style.display = "block";
		positionH2(nowId).parentNode.parentNode.previousElementSibling.onoff = true;
		if(positionH2(nowId).nextElementSibling){
			positionH2(nowId).nextElementSibling.style.display = "block";
			positionH2(nowId).style.background="active";
			t.addClass(positionH2(nowId).children[0],"active");
			positionH2(nowId).children[1].className="active";
			positionH2(nowId).onoff = true;
		}
		xuanran(nowId);
	}
})
//单选
var emcheck=files.getElementsByTagName("em");
var checkall=document.querySelector(".check-all");
t.on(files,"click",function(e){
	var target=e.target;
	if(target.nodeName=="EM"){
		t.toggleClass(target,"checked");
		var bool=Array.from(emcheck).every(function(a){
			return t.hasClass(a,"checked")
		})
		if(bool){
			t.addClass(checkall,"checked");
		}else{
			t.removeClass(checkall,"checked");
		}
	}
})
//全选
t.on(checkall,"click",function(){	
	var childs=fnAll.getChilds(datas,last);
	if(!childs.length){
		return;
	}
	var bool = t.toggleClass(this,"checked");
//	console.log(emcheck)
	Array.from(emcheck).forEach(function(a){
		if(bool){
			t.addClass(a.parentNode,"active");
			t.addClass(a,"checked");
		}else{
			t.removeClass(a,"checked");
			t.removeClass(a.parentNode,"active");
		}
	})
})

//鼠标移入事件
t.on(files,"mouseover",function(e){
	var target=e.target;
	if(target = t.parent(target,"li")){
		t.addClass(target,"active");
	}
})
//鼠标移出事件
t.on(files,"mouseout",function(e){
	var target=e.target;
	if(target = t.parent(target,"li")){
		if(!t.hasClass(target.children[0],"checked") )
		t.removeClass(target,"active");
	}
})


//成功或删除操作提示
function fullTip(className,message){
	popup.style.transition = "none";
	popup.style.top = "-38px";
	setTimeout(function (){
		t.addClass(popup,className);
		popup.style.transition = ".3s";
		popup.style.top = "0";	
	},0)
	popup.innerHTML = message;
	//延时上去的定时器只能有一个
	clearTimeout(popup.timer);
	popup.timer = setTimeout(function (){
		popup.style.top = "-38px";
		t.removeClass(popup,className);
	},2000)	
}
//新建文件夹
var create=document.getElementById("createFile");
t.on(create,"mouseup",function(){
	var firstElement = files.firstElementChild;
	var fileLi=document.createElement("li");
	fileLi.innerHTML="<em></em><span></span><input type='text' />";
	if( firstElement ){
		files.insertBefore(fileLi,firstElement);
	}else{
		files.appendChild(fileLi);
	}
	var noFile=files.getElementsByTagName("div")[0];
	noFile.className="yes";
	var fileText = fileLi.getElementsByTagName("input")[0];
	t.addClass(fileText,"active");
	fileText.focus();
	create.isCreate = true;
})

//点击document创建
t.on(document,"mousedown",createFile);
//按住enter键新建
t.on(document,"keyup",function (ev){
	if( ev.keyCode === 13 ){
		createFile();
	}
})
//创建文件函数
function createFile(e){
//如果不是新建状态，不在继续执行
	if( !create.isCreate ) return;
//先要找到新建的第一个元素
	var firstElement = files.firstElementChild;
	var fileTitle = firstElement.getElementsByTagName("span")[0];
	var fileText = firstElement.getElementsByTagName("input")[0];
	//通过value值判断是否要新建
	var value = fileText.value.trim();
	if( value ){  //新建
		//不能有重名的项 提醒
		var isExist = fnAll.isTitleExist(datas,value,last);
		//名字存在
		if(isExist){		
			files.removeChild(firstElement);
			fullTip("popup","命名冲突，新建不成功");
		}
		else{ //不存在，新建成功    添加信息
			t.removeClass(fileText,"active")
			fileTitle.innerHTML = value;
			var id = Math.random();
			datas.unshift({
				id:id,
				pid:last,
				title:value,
				type:"file"
			});
			firstElement.setAttribute("data-id",id);
			cont_left.innerHTML=listStr(-1);
			var uls = positionH2(last).parentNode.parentNode.getElementsByTagName("ul");			
			var spans=positionH2(last).parentNode.parentNode.getElementsByTagName("span");
			var ems=positionH2(last).parentNode.parentNode.getElementsByTagName("em");
			for (var j = 0; j < spans.length; j++) {
				t.removeClass(spans[j],"active");
				ems[j].className="";
			}
			for (var i = 0; i < uls.length; i++) {
				uls[i].style.display = "none";
				uls[i].previousElementSibling.onoff = false;
			}
			positionH2(last).nextElementSibling.style.display = "block";
			positionH2(last).style.background="active";
			t.addClass(positionH2(last).children[0],"active");
			positionH2(last).children[1].className="active";
			positionH2(last).onoff = true;
			
			
			fullTip("success","新建成功");
			var selectArr = whoSelect();//新建之后把选中的勾选去掉，全选清空
			selectArr.forEach(function (item){
				var ems = item.getElementsByTagName("em")[0];
				t.removeClass(ems,"checked");
				t.removeClass(item,"active");
			});
			t.removeClass(checkall,"checked");
		}
	}else{//不新建
		files.removeChild(firstElement);
		var childs = fnAll.getChilds(datas,last);
		if( !childs.length ){
			var noFile=files.getElementsByTagName("div")[0];
			noFile.className="no";
		}
	}
	create.isCreate = false;
}
//点击文本框阻止document的冒泡
t.on(files,"mousedown",function(e){
	if(e.target.nodeName=="INPUT"){
		e.stopPropagation();
	}
})

//点击删除
var dlt=document.getElementById("delete");
function whoSelect(){//谁选中了的
	return Array.from(emcheck).filter(function (a){
		return t.hasClass(a,"checked");	
	}).map(function (item){
		return item.parentNode;
	})
}
t.on(dlt,"click",function(){
	var arr=whoSelect();
	var idArr=[];
	if(arr.length){
		dialog({
			title:"删除文件",
			content:"<div style='padding: 10px;'>确定要删除这个文件夹吗？已删除的文件可以在回收站找到</div>",
			okFn:function(){
				for (var i = 0; i < arr.length; i++) {
					idArr.push(arr[i].dataset.id);
				}
				fnAll.deleteChildsAllByIdArr(datas,idArr);
				xuanran(last);
				cont_left.innerHTML=listStr(-1);
				fullTip("success","删除成功");
			}
		})
		
	}else{
		fullTip("popup","请选择文件");
	}
})

//框选+框选后的移动。
var cont_right=document.querySelector(".cont_right");
var lis = files.getElementsByTagName("li");
var div=null;
var	sketchDiv = null; //剪影
var	imposterDiv = null; //伪装者 小红点
var	isHitElement = null;
cont_right.onmousedown = function(e){
	if(e.which !== 1) return;
	if(t.hasClass(files.children[0],"no")) return;
	
	var isChecked = false; //默认不选中
	if( t.parent(e.target,"li") ){//点到文件夹上
		isChecked = !!t.parent(e.target,"li").querySelector(".checked");
	}
	var oriX = e.clientX ;
	var oriY = e.clientY ;	
	document.onmousemove = function(e){
		//移动功能
		if(isChecked){
				//如果移动的距离，大于5个像素，才能够生成剪影和伪装者
			if( Math.abs( e.clientX - oriX ) < 5 && Math.abs( e.clientY - oriY ) < 5 ){
				return;
			}
			var selectArr = whoSelect();  //存的是选中的
			if( !sketchDiv ){//拖拽的是一个剪影
				sketchDiv = document.createElement("div");
				sketchDiv.className = "xuying";
				sketchDiv.innerHTML="<span>"+selectArr.length+"</span>";
		        document.body.appendChild(sketchDiv);
		        //生成一个div，目的是在同一个文件down有up的时候，不至于进到这个文件的下一级,触发文件夹的点击事件
		       	imposterDiv = document.createElement("div");
		        imposterDiv.style.cssText = `   width: 10px;
		        								height: 10px;
		        								background: red;
		        								position: absolute;
		        								left:0;
		        								top:0;
//		        								opacity: 0;
		        							`;
		       	 document.body.appendChild(imposterDiv);
			}
	        sketchDiv.style.left = e.clientX+15 + "px";
	        sketchDiv.style.top = e.clientY+15 + "px";
	        imposterDiv.style.left = e.clientX-5 + "px";
	        imposterDiv.style.top = e.clientY-5 + "px";
	        //伪装者和那个li碰上了，这个li就添加上样式
	        //selectArr 选中的
	        isHitElement = null;//一直为null
// 	        a:for( var i = 0; i < lis.length; i++ ){        	        	
// 	        	for( var j = 0; j < selectArr.length; j++ ){
// 	        		if( selectArr[j] === lis[i] ){
// // 排除选中的	        	continue:a
// 	        		}
// 	        	}
// 	        	//如果是选中的文件，跳过碰撞检测的
// 	        	if( peng(imposterDiv,lis[i]) ){
// 	        		t.addClass(lis[i],"active");
// 	        		//存一下被碰撞的元素
// 	        		isHitElement = lis[i];		
// 	        	}else{
// 	        		t.removeClass(lis[i],"active");	        		
// 	        	}
// 	        }
	        for( var i = 0; i < lis.length; i++ ){
	        	var onOff = false;
	        	//排除选中的
	        	
	        	for( var j = 0; j < selectArr.length; j++ ){
	        		if( selectArr[j] === lis[i] ){
	        			onOff = true;
	        		}
	        	}
	        	//如果是选中的文件，跳过碰撞检测的
	        	if( onOff ) continue;


	        	if( peng(imposterDiv,lis[i]) ){
	        		t.addClass(lis[i],"active");
	        		//存一下被碰撞的元素
	        		isHitElement = lis[i];		
	        	}else{
	        		t.removeClass(lis[i],"active");	        		
	        	}
	        }
			return;
		}	
		
		//框选功能
		if(Math.abs( e.clientX - oriX )>15||Math.abs( e.clientY - oriY )>15){
			if(!div){
				div = document.createElement("div");
				div.className = "box";
				files.appendChild(div);
			}
			div.style.left = Math.min( e.clientX,oriX ) + "px";
			div.style.top = Math.min( e.clientY-130,oriY-130) + "px";
			div.style.width = Math.abs( e.clientX - oriX ) + "px";
			div.style.height = Math.abs( e.clientY - oriY ) + "px";
			for (var i = 0; i < lis.length; i++) {//让div和每一个li进行碰撞检测
				if( peng(div,lis[i]) ){//碰到
					t.addClass(lis[i],"active");
					t.addClass(lis[i].children[0],"checked");
				}else{
					t.removeClass(lis[i],"active");
					t.removeClass(lis[i].children[0],"checked");
				}
				var selectArr = whoSelect();
				if( selectArr.length === lis.length ){
					t.addClass(checkall,"checked")
				}else{
					t.removeClass(checkall,"checked")
				}
			}
		}
	}
	document.onmouseup = function(){
		document.onmousemove = null;
		if(div){
			files.removeChild( div );
			div=null;
		}
		if( sketchDiv ){
			document.body.removeChild(sketchDiv);
			document.body.removeChild(imposterDiv);
			sketchDiv = null;
			imposterDiv = null;
		}
		document.onmouseup = null;	
		//判断碰撞元素isHitElement是否存在,如果存在就把所选文件放入此文件夹中.
		if(isHitElement){
			var onOff = false;
			var selectArr = whoSelect();
			var selectIdArr = selectArr.map(function (item){
				return item.dataset.id;
			})
			var nowId = isHitElement.dataset.id;
			for( var i = 0; i < selectIdArr.length; i++ ){
				//找到选中的id对应的数据
				var self = fnAll.getSelf(datas,selectIdArr[i]);
					//判断一下self.title是否已经存在nowId下的子数据中						
				var isExist = fnAll.isTitleExist(datas,self.title,nowId);
				//如果存在不改pid
				if( !isExist ){
					self.pid = nowId;
					files.removeChild(selectArr[i]);
				}else{
					onOff = true;  //只要onOff为true，说明有一个移动失败，因为重名了
				}
			}
			if(onOff){
				fullTip("popup","部分文件移动失败，重名了");
			}
			cont_left.innerHTML = listStr(-1);

			//释放一下变量，目的是移动之后，不要再up后再次出发移动的判断
			isHitElement = null;
		}
	}
	return false;
}
function peng(obj1,obj2){//返回结果如果为true，说明碰到
	var pos1 = obj1.getBoundingClientRect();
	var pos2 = obj2.getBoundingClientRect();
	return pos1.right > pos2.left && pos1.left < pos2.right && pos1.bottom > pos2.top && pos1.top < pos2.bottom;
}
document.onmousedown=function(){
	return false;
}

//点击重命名
var rename=document.getElementById("rename");
var re_obj = {};  //保存当前正在重名所需要的元素
t.on(rename,"click",function (){
	var selectArr = whoSelect();
	if(  selectArr.length === 1){
		re_obj.element = selectArr[0];
		re_obj.fileTitle = re_obj.element.getElementsByTagName("span")[0];
		re_obj.fileText = re_obj.element.getElementsByTagName("input")[0];
		re_obj.fileTitle.style.display = "none";
		re_obj.fileText.style.display = "block";
		re_obj.fileText.value = re_obj.fileTitle.innerHTML.trim();
		re_obj.fileText.select();	
		rename.isRename = true;//正在重命名
	}else if(selectArr.length > 1){
		fullTip("popup","只能对单个文件进行重命名")
	}else {
		fullTip("popup","请选择重命名的文件")
	}
})
//重命名是否成功
t.on(document,"mousedown",function (){
	if( !rename.isRename ){
		return;
	}
	var value = re_obj.fileText.value.trim();
	if( value ){//有value值
		var isExist = fnAll.isTitleExist(datas,value,last);
		if(value === re_obj.fileTitle.innerHTML.trim()){//点击重命名没修改value值
		}else if(isExist){//如果命名冲突，还原以前的名字
			fullTip("popup","命名冲突，请重新命名");
		}else{
			fullTip("success","命名成功");
			re_obj.fileTitle.innerHTML = value;
			//通过id找到对应的数据
			var self = fnAll.getSelf(datas,re_obj.element.dataset.id);
			self.title = value;
			cont_left.innerHTML=listStr(-1);			
		}
	}
	re_obj.fileTitle.style.display = "block";
	re_obj.fileText.style.display = "none";
	t.removeClass(re_obj.element,"active");
	t.removeClass(re_obj.element.children[0],"checked");
	rename.isRename = false;
});

//点击移动到事件
var shift=document.getElementById("shift");
t.on(shift,"click",function(){
	var selectArr = whoSelect();
	var moveStatus = true;  //默认为true，没选任何一个目录，不能关闭弹窗
	var nowId = null;
	if(selectArr.length){
		dialog({
			title:"移动到",
			content:"<div class='cont_left newTree'>"+listStr(-1)+"</div>",
			okFn:function(){
				if( moveStatus ){
					return true;
				}else{
					var onOff = false;
					for( var i = 0; i < selectIdArr.length; i++ ){
						//找到选中的id对应的数据
						var self = fnAll.getSelf(datas,selectIdArr[i]);
							//判断一下self.title是否已经存在nowId下的子数据中						
						var isExist = fnAll.isTitleExist(datas,self.title,nowId);
						//如果存在不改pid
						if( !isExist ){
							self.pid = nowId;
							files.removeChild(selectArr[i]);
						}else{
							onOff = true;  //只要onOff为true，说明有一个移动失败，因为重名了
						}
					}
					if(onOff){
						fullTip("popup","部分文件移动失败，重名了");
					}
					cont_left.innerHTML = listStr(-1);
				}
			}
		})
		var newTree=document.querySelector(".newTree");
		var selectIdArr = [];  //保存的是选中的id
		for( var i = 0; i < selectArr.length; i++ ){
			selectIdArr.push(selectArr[i].dataset.id);//找到所选择的id。
		}
		var allSelect=fnAll.getChildsAllByIdArr(datas,selectIdArr);//找到id下所有的子集，包含本身。
		var error = document.querySelector(".full-pop .error");
		var weiyun = newTree.getElementsByTagName("h2")[0];
		weiyun.style.background="#e1e8ee"//初始化加颜色
		var lastElement=weiyun;
		t.on(newTree,"click",function(e){
			var target=e.target;
			if(target=t.parent(target,"h2")){
				lastElement.style.background="";
				target.style.background="#e1e8ee";
				lastElement=target;
				nowId=target.dataset.id;
				var nowData=fnAll.getSelf(datas,nowId);//找到点击本身的数据
				var selectData=fnAll.getSelf(datas,selectIdArr[0]);
				if( nowId == selectData.pid ){
					error.innerHTML = "该文件下已经存在";
					moveStatus = true;//不能关闭弹框
					return;
				}
				var onOff = false;
				for( var i = 0; i < allSelect.length; i++ ){
					if( nowData.id === allSelect[i].id ){//将点击的id与所选id的子集比较，不能移到本身下或所选id的子集下
						onOff = true;
						break;
					}
				}
				if( onOff ){
					error.innerHTML = "不能将文件移动到自身或其子文件夹下";
					moveStatus = true; //不能关闭弹框
				}else{
					error.innerHTML = "";
					moveStatus = false;//可以关闭弹框
				}
			}
		})
	}else{
		fullTip("popup","请选择要移动的文件");
	}
})