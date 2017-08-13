var cont_left=document.getElementsByClassName("cont_left")[0];
var contents=document.querySelector(".content");
console.log(contents)
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

var nav=document.getElementsByClassName("cont_r_head")[0];
//通过id生成nav
function navStr(id){
	var str="";
	fnAll.getParents(datas,id).reverse().forEach(function(a){
		str+="<span data-id='"+a.id+"'>"+a.title+"</span>"
	})
	return str;
}
nav.innerHTML=navStr(0);//初始化

//通过id生成file区
var file=document.getElementsByClassName("file-list")[0];
function fileStr(id){
	var str="";
	if(!fnAll.getChilds(datas,id).length){
		str="<li class='no'></li>";
	}
	fnAll.getChilds(datas,id).forEach(function(a){
		str+="<li><span></span>"+a.title+"</li>";
	})
	return str;
}
file.innerHTML=fileStr(0);//初始化

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

//点击左侧list。
var last=0;
//h2s[0].style.background="#e1e8ee";
//Lspans[0].className="active";
//Lems[0].className="active";
Luls[0].style.display="block";
//Luls[1].style.display="block";
t.on(cont_left,"click",function(e){
	var target=e.target;
	if(target=t.parent(target,"h2")){
		var nowId=target.dataset.id;
		positionH2(last).style.background="";
		positionH2(nowId).style.background="#e1e8ee";
		last=nowId;
		nav.innerHTML=navStr(nowId);
		nav.lastElementChild.className="active";
		file.innerHTML=fileStr(nowId);
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
for (var i = 0; i < h2s.length; i++) {
	h2s[i].onoff=false;//h2同级下的ul代表全都关闭
	h2s[i].onclick=function(){
//		var nowId=this.dataset.id;
//		positionH2(last).style.background="";
//		positionH2(nowId).style.background="#e1e8ee";
//		last=nowId;
//		nav.innerHTML=navStr(nowId);
//		nav.lastElementChild.className="active";
//		file.innerHTML=fileStr(nowId);
//		if(!this.nextElementSibling){
//			var uls = this.parentNode.parentNode.getElementsByTagName("ul");
//			var spans=this.parentNode.parentNode.getElementsByTagName("span");
//			var ems=this.parentNode.parentNode.getElementsByTagName("em");
//			for (var j = 0; j < spans.length; j++) {
//				spans[j].className="";
//				ems[j].className="";
//			}
//			for (var i = 0; i < uls.length; i++) {
//				uls[i].style.display = "none";
//				uls[i].previousElementSibling.onoff = false;
//			}
//			return ;
//		}
//		if(this.onoff){//
//			//如果h2下面的ul是打开的,那合上它
//			//然后把点击的h2内部所有的ul全部关上
//			this.nextElementSibling.style.display = "none";
//			this.children[0].className="";
//			this.children[1].className="";
//			this.onoff = false;
//			var uls = this.nextElementSibling.getElementsByTagName("ul");
//			var spans=this.nextElementSibling.getElementsByTagName("span");
//			var ems=this.nextElementSibling.getElementsByTagName("em");
//			for (var j = 0; j < spans.length; j++) {
//				spans[j].className="";
//				ems[j].className="";
//			}
//			for (var i = 0; i < uls.length; i++) {
//				uls[i].style.display = "none";
//				uls[i].previousElementSibling.onoff = false;
//			}
//		}else{
//			//h2下面的ul是关闭的
////			    			把同级的h2里面的ul全部关上
////							然后把点击的h2下面的ul打开
//			var uls = this.parentNode.parentNode.getElementsByTagName("ul");
//			var spans=this.parentNode.parentNode.getElementsByTagName("span");
//			var ems=this.parentNode.parentNode.getElementsByTagName("em");
//			for (var j = 0; j < spans.length; j++) {
//				spans[j].className="";
//				ems[j].className="";
//			}
//			for (var i = 0; i < uls.length; i++) {
//				uls[i].style.display = "none";
//				uls[i].previousElementSibling.onoff = false;
//			}
//			this.nextElementSibling.style.display = "block";
//			this.children[0].className="active";
//			this.children[1].className="active";
//			this.onoff = true;
//		}
	}
}

//点击nav区域
nav.onclick=function(e){
	var span=e.target;
	if(span.nodeName.toLowerCase()==="span"){
		var nowId=span.dataset.id;
		var uls = positionH2(nowId).parentNode.parentNode.getElementsByTagName("ul");
		var spans=positionH2(nowId).parentNode.parentNode.getElementsByTagName("span");
		var ems=positionH2(nowId).parentNode.parentNode.getElementsByTagName("em");
		for (var j = 0; j < spans.length; j++) {
			spans[j].className="";
			ems[j].className="";
		}
		for (var i = 0; i < uls.length; i++) {
			uls[i].style.display = "none";
			uls[i].previousElementSibling.onoff = false;
		}
		positionH2(nowId).nextElementSibling.style.display = "block";
		positionH2(nowId).style.background="active";
		positionH2(nowId).children[0].className="active";
		positionH2(nowId).children[1].className="active";
		positionH2(nowId).onoff = true;
		
		
		positionH2(last).style.background="";
		positionH2(nowId).style.background="#e1e8ee";
		last=nowId;
		nav.innerHTML=navStr(nowId);
		nav.lastElementChild.className="active";
		file.innerHTML=fileStr(nowId);
	}
}

//点击文件区域
file.onclick=function(e){
	var li=e.target;
	if(li.nodeName.toLowerCase()==="li"){
		li.children[0].style.display="block";
	}
}
