var win = {
	setSmallwin:function (obj){
		obj = obj || {};
		win.def = {//处理不设置修改的情况
						title:"这是一个弹框（这是默认的标题）",
						content:"萌萌哒的小清新提醒您，删除的文件可以在垃圾桶找到！(这是默认的内容)",
						ifmove: false,//默认可以不移动
						disX: "",
						disY: "",
						okfn:function(){}
				};//默认值
				
		for(var attr in obj){
			win.def[attr] = obj[attr];
		}
		
		win.pos.disx = win.def.disX;
		win.pos.disy = win.def.disY;
		
	
		win.setTitCont(win.def.title, win.def.content, win.def.ifmove);
		
		var diaDiv = document.querySelector("#tanbox");
		var close = diaDiv.querySelector(".btnclose");
		var ok = diaDiv.querySelector(".btnconfirm");
		var cancel = diaDiv.querySelector(".btncancel");
		var mask = document.querySelector(".mask");

		close.addEventListener("click",function (){
			document.body.removeChild(diaDiv);
			document.body.removeChild(mask);
		},false);
		
		ok.addEventListener("click",function (){
	
			var bl = win.def.okfn(); 
			/*
				1. return undefined 关闭
				2. return false  关闭
				3. return true   不关闭
			*/
	
			if( !bl ){
				document.body.removeChild(diaDiv);
				document.body.removeChild(mask);
			}
	
			
		},false);
		
		cancel.addEventListener("click",function (){
			document.body.removeChild(diaDiv);
			document.body.removeChild(mask);
		},false);
	},
	html: function(){//将默认的弹框，放入到页面中
		var odiv = document.createElement("div");
		odiv.id = "tanbox";
		
		var html = `<div class="close_btn">
						<a class="btnclose" href="javascript:;">X</a>
						<h3 class="title"></h3>
					</div>
					<div class="pcontent">萌萌哒的小清新提醒您，删除的文件可以在垃圾桶找到！</div>
					<div class="btns">
						<a class="btnconfirm" href="javascript: void(0);">确定</a>
						<a class="btncancel" href="javascript: void(0);">取消</a>
					</div>`;
		odiv.innerHTML = html;
		
		return odiv;
	},
	setTitCont:function(title, content, ifmove){//修改弹框的标题和内容
		
		var odiv = win.html();
		
		win.divbox = odiv;
		document.body.appendChild(odiv);
		
		var mask = document.createElement("div");
		mask.className = "mask";
		mask.style.cssText = "width: 100%; height: 100%; opacity: 0.5; position: fixed; left: 0px; top: 0px; z-index: 99; background: rgb(0, 0, 0);"
		mask.style.zIndex = 99;
		document.body.appendChild(mask);
		
		win.setPosition();
		win.divResize();
		
		if(ifmove){
			win.move();
		}
		
		var tit = odiv.querySelector(".title");
		var cont = odiv.querySelector(".pcontent");
		
		tit.innerHTML = title;
		cont.innerHTML = content;
	},
	divbox: null,
	def:null,
	pos:{}, //初始位置
	getView:function(){//获取当前页面的宽高,以便后边的对弹窗的位置的设置
		return{
			w: document.documentElement.clientWidth,
			h: document.documentElement.clientHeight
		};
	},
	setPosition:function(){//设置居中
		win.divbox.style.left = (win.getView().w -win.divbox.clientWidth)/2 + "px";
		win.divbox.style.top = (win.getView().h - win.divbox.clientHeight)/4 + "px";
		
		if(win.pos.disx){
			win.divbox.style.left = win.pos.disx + "px";
		}
		if(win.pos.disy){
			win.divbox.style.top = win.pos.disy + "px";
		}
	},
	divResize:function(){
		window.addEventListener("resize", win.setPosition, false);
	},
	move:function(){
		win.divbox.onmousedown = function(e){
		
			var oldX = e.clientX - win.divbox.offsetLeft;
			var oldY = e.clientY - win.divbox.offsetTop;
			
			document.onmousemove = function(e){
				win.divbox.style.left = e.clientX - oldX + "px";
				win.divbox.style.top = e.clientY - oldY + "px";
				
				if(win.pos.disx){
					win.divbox.style.left = disx + "px";
				}
				if(win.pos.disy){
					win.divbox.style.top = disy + "px";
				}
			}
			
			document.onmouseup = function(){
				document.onmousemove = null;
				document.onmouseup = null;
			}
			return false;
		}
	}
};
