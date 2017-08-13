(function(){
	var methods = {
		view(){//获取可视区的宽高
			return{
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			}
		},
		on(elem, evName, evFn){//为元素添加事件处理函数
			elem.addEventListener(evName, evFn, false);
		},
		off(elem, evName, evFn){//为元素清除事件处理函数
			elem.removeEventListener(evName, evFn, false);
		},
		hasClass(elem, classname){//判断元素是不是有某个class
			if(!elem){//如果点击的对象没有class的话就直接返回
				return false;
			}
			var classArr = elem.className.split(" ");
			for( var i = 0; i < classArr.length; i++ ){
				if( classArr[i] === classname ){
					return true;
				}
			}
			return false;
		},
		addClass(elem, classname){//为含有多个class的元素添加class
			if(!methods.hasClass(elem, classname)){//如果没有这个class
				elem.className += " " + classname;
			}
		},
		removeClass(elem, classname){//为含有多个class的元素删除某个class
			if(methods.hasClass(elem, classname)){//如果有这个class
				var classArr = elem.className.split(" ");
				for(var i=classArr.length-1; i>=0; i--){//为了确保能删除元素中同名的多个class，要从后往前删
					if(classArr[i] === classname){
						classArr.splice(i,1);
					}
				}
				elem.className = classArr.join(" ");
			}
		},
		toggleClass(elem, classname){//看指定的元素是不是有某个class，若有，就删除；若没有，就添加
			if(methods.hasClass(elem, classname)){
				methods.removeClass(elem, classname);
				return false;
			}else{
				methods.addClass(elem, classname);
				return true;
			}
		},
		parent(elem, attr){//查找元素的满足属性为attr的最近父级,class->.class, tagname->tagname, id->#id
			var firstChar = attr.charAt(0);
			if(firstChar == "."){
				while(elem.nodeType!=9 && !methods.hasClass(elem, attr.slice(1))){
					elem = elem.parentNode;
				}
			}else if(firstChar == "#"){
				while(elem.nodeType!=9 && elem.id!==attr.slice(1)){
					elem = elem.parentNode;
				}
			}else{
				while(elem.nodeType!=9 && elem.nodeName!==attr.toUpperCase()){
					elem = elem.parentNode;
				}
			}
			return elem.nodeType==9 ? null:elem;
		}
//		dragdiv(divs){//拖拽
//			if(!!divs)  return;
//			for (var i = 0; i < divs.length; i++) {
//				divs[i].style.left = divs[i].offsetLeft + "px";
//				divs[i].style.top = divs[i].offsetTop + "px";
//			}
//			for (var i = 0; i < divs.length; i++) {
//				divs[i].style.position = "absolute";
//				divs[i].style.margin = "0";
//				divs[i].style.float = "none";
//				drag( divs[i] );
//			}
//			function drag(obj){
//				console.log("dragme");
//				obj.onmousedown = function(e){
//					//确定可以拖动的元素；
//					obj.isSelected = true;
//					obj.style.background = "red";
//					var elems = [];
//					for (var i = 0; i < divs.length; i++) {
//						if( divs[i].isSelected ){
//							elems.push(divs[i])
//							//保存鼠标按下的时候鼠标距离每一个被选中的元素左侧的长度存到它的自定义属性中
//							divs[i].disX = e.clientX - divs[i].offsetLeft;
//							divs[i].disY = e.clientY - divs[i].offsetTop;
//						}
//					}
//					document.onmousemove = function(e){
//	//						循环所有被选中的元素，更改他们的left和top
//						for (var i = 0; i < elems.length; i++) {
//							elems[i].style.left = e.clientX - elems[i].disX + "px";
//							elems[i].style.top = e.clientY - elems[i].disY + "px"; 
//						}
//					}
//					document.onmouseup = function(){
//						document.onmousemove = null;						
//					}
//					e.cancelBubble =true;
//					return false;
//				}
//			}
//			
//		}
	}
	window.t = methods;
})()
