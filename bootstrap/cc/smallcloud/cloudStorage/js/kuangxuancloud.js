var cont_left=document.getElementsByClassName("cont_left")[0];
var contents=document.querySelector(".content");
var popup=document.querySelector(".popup");
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
		var className = childs2.length ? "yes" : "no";
		str+="<li><h2 style='padding-left:"+20*parentsLength+"px' data-id='"+a.id+"'><span class='"+className+"'></span><em></em>"+a.title+"</h2>";
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
Luls[0].style.display="block";
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
				uls[i].previousElementSibling.onoff = false;
			}
			return ;
		}
		if(target.onoff){//
			//如果h2下面的ul是打开的,那合上它
			//然后把点击的h2内部所有的ul全部关上
			target.nextElementSibling.style.display = "none";
			t.removeClass(target.children[0],"active");
			target.children[1].className="";
			target.onoff = false;
			var uls = target.nextElementSibling.getElementsByTagName("ul");
			var spans=target.nextElementSibling.getElementsByTagName("span");
			var ems=target.nextElementSibling.getElementsByTagName("em");
			for (var j = 0; j < spans.length; j++) {
				t.removeClass(spans[j],"active");
				ems[j].className="";
			}
			for (var i = 0; i < uls.length; i++) {
				uls[i].style.display = "none";
				uls[i].previousElementSibling.onoff = false;
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
				uls[i].previousElementSibling.onoff = false;
			}
			target.nextElementSibling.style.display = "block";
			t.addClass(target.children[0],"active")
			target.children[1].className="active";
			target.onoff = true;
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
function fullTip(message){
	popup.style.transition = "none";//为什么改了时间就不行
	popup.style.top = "-38px";
	setTimeout(function (){
//		t.addClass(fullTipBox,className);
		popup.style.transition = ".3s";
		popup.style.top = "0";	
	},0)
	popup.innerHTML = message;
	//延时上去的定时器只能有一个
	clearTimeout(popup.timer);
	popup.timer = setTimeout(function (){
		popup.style.top = "-38px";

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
			fullTip("命名冲突，新建不成功");
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
			
			
			fullTip("新建成功");
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
		for (var i = 0; i < arr.length; i++) {
			idArr.push(arr[i].dataset.id);
		}
		fnAll.deleteChildsAllByIdArr(datas,idArr);
		xuanran(last);
		cont_left.innerHTML=listStr(-1);
	}else{
		fullTip("请选择文件");
	}
})

//框选
var cont_right=document.querySelector(".cont_right");
var lis = files.getElementsByTagName("li");
	//画方块
//		t.on(document,"mousedown",function (ev){
//			//找到操作的file-item 判断下面checkbox是否有class为checked
//			var isChecked = false;
//			if( t.parent(ev.target,".file-item") ){
//				isChecked = !!t.parent(ev.target,".file-item").querySelector(".checked");
//			}
//			disX = ev.clientX;  //摁下去的x位置
//			disY = ev.clientY;  //摁下去的Y位置			
//			document.onmousemove = function (ev){
//				if(isChecked){
//					console.log("选中");
//					return;
//				}
//				//在move的过程中，只生成一个div，只要生成了了一个div之后，就没必要再生成了
//				//生成的div，要在一定的范围之后才append到body中
//				//15像素
//				//15个像素
//				if( Math.abs( ev.clientX - disX ) > 15 || Math.abs( ev.clientY - disY ) > 15 ){
//
//					if( !div ){
//						div = document.createElement("div");
//						div.className = "kuang";
//						document.body.appendChild(div);
//					}
//					//判断是否全选
					
//				}
//
//
//
//			}
//
//	});
cont_right.onmousedown = function(e){
	if(e.which !== 1) return;
	var div = document.createElement("div");
	div.className = "box";
	files.appendChild(div);		
	var oriX = e.clientX ;
	var oriY = e.clientY ;	
	document.onmousemove = function(e){
		if(Math.abs( e.clientX - oriX )>15||Math.abs( e.clientY - oriY )>15){
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
		files.removeChild( div );
		document.onmouseup = null;
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
//for (var i = 0; i < lis.length; i++) {
//	lis[i].onmousedown=function(e){
//		e.cancelBubble=true;
//	}
//}
